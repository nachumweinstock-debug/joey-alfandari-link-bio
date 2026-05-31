const defaultRepo = "nachumweinstock-debug/joey-alfandari-link-bio";

function getRepo() {
  if (process.env.GITHUB_REPO) return process.env.GITHUB_REPO;
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  if (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG) {
    return `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`;
  }
  return defaultRepo;
}

function getBranch() {
  return process.env.GITHUB_DATA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main";
}

function getToken() {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
}

function headers() {
  const token = getToken();
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function contentUrl(path) {
  return `https://api.github.com/repos/${getRepo()}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
}

async function fetchJsonFile(path, fallback) {
  const response = await fetch(`${contentUrl(path)}?ref=${encodeURIComponent(getBranch())}`, {
    headers: headers(),
  });

  if (response.status === 404) return { json: fallback, sha: null };
  if (!response.ok) {
    throw new Error(`GitHub read failed: ${response.status}`);
  }

  const data = await response.json();
  const text = Buffer.from(data.content || "", "base64").toString("utf8");
  return {
    json: JSON.parse(text),
    sha: data.sha,
  };
}

async function readJson(path, fallback) {
  return (await fetchJsonFile(path, fallback)).json;
}

async function writeJson(path, value) {
  const token = getToken();
  if (!token) {
    throw new Error("GitHub content storage is not configured");
  }

  const current = await fetchJsonFile(path, null).catch((error) => {
    if (error.message?.includes("404")) return { sha: null };
    throw error;
  });

  const body = {
    branch: getBranch(),
    content: Buffer.from(JSON.stringify(value, null, 2)).toString("base64"),
    message: `Update ${path}`,
    ...(current.sha ? { sha: current.sha } : {}),
  };

  const response = await fetch(contentUrl(path), {
    method: "PUT",
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub write failed: ${response.status} ${text}`);
  }

  return value;
}

module.exports = {
  readJson,
  writeJson,
};
