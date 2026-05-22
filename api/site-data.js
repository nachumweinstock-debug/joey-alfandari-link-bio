const settingsPath = "brave-spark/site-settings.json";

const defaultSiteSettings = {
  handle: "@brave_spark_",
  name: "Brave Spark",
  tagline: "Motivation, mindset, and real-life growth with a human punch.",
  bio: [
    "I'm Brave Spark, a Long Island, New York creator making motivation feel human again.",
    "My work mixes storytelling, humor, vulnerability, and sharp real-life messages for people who want more than empty inspiration.",
    "Brave does not mean polished. Brave means showing up, telling the truth, and turning real moments into content that actually lands.",
    "If it feels honest, cinematic, and a little uncomfortable in the right way, that's the spark.",
  ].join("\n\n"),
};

function cleanSettings(record = {}) {
  return {
    handle:
      typeof record.handle === "string" && record.handle.trim()
        ? record.handle.trim()
        : defaultSiteSettings.handle,
    name:
      typeof record.name === "string" && record.name.trim()
        ? record.name.trim()
        : defaultSiteSettings.name,
    tagline:
      typeof record.tagline === "string" && record.tagline.trim()
        ? record.tagline.trim()
        : defaultSiteSettings.tagline,
    bio:
      typeof record.bio === "string" && record.bio.trim()
        ? record.bio.trim()
        : defaultSiteSettings.bio,
  };
}

async function readSettings() {
  const { get } = require("@vercel/blob");

  try {
    const result = await get(settingsPath, { access: "public" });
    if (!result?.stream) return defaultSiteSettings;

    const text = await new Response(result.stream).text();
    return cleanSettings(JSON.parse(text));
  } catch (error) {
    if (error?.message?.includes("No token")) throw error;
    return defaultSiteSettings;
  }
}

async function writeSettings(record) {
  const { put } = require("@vercel/blob");
  const settings = cleanSettings(record);

  await put(settingsPath, JSON.stringify(settings, null, 2), {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });

  return settings;
}

module.exports = {
  defaultSiteSettings,
  readSettings,
  settingsPath,
  writeSettings,
};
