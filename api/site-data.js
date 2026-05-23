const settingsPath = "brave-spark/site-settings.json";

const defaultSiteSettings = {
  profilePhotoUrl: "/profile-photo.jpg",
  handle: "@brave_spark_",
  name: "Brave Spark",
  tagline: "Motivation, mindset, and real-life growth with a human punch.",
  metaTitle: "Brave Spark | @brave_spark_",
  metaDescription:
    "Brave Spark, @brave_spark_, motivation, mindset, and creative video work.",
  videoEyebrow: "Video Work",
  videoHeadline: "Built for vertical stories.",
  links: [
    {
      id: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/brave_spark_/",
      variant: "light",
    },
    {
      id: "contact",
      label: "Contact",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSc_jZ6p4xNrtJxUqtxWcUkvZHlnmYXX48O3-wG4J_oe5H0Oug/viewform?usp=publish-editor",
      variant: "dark",
    },
  ],
  bio: [
    "I'm Brave Spark, a Long Island, New York creator making motivation feel human again.",
    "My work mixes storytelling, humor, vulnerability, and sharp real-life messages for people who want more than empty inspiration.",
    "Brave does not mean polished. Brave means showing up, telling the truth, and turning real moments into content that actually lands.",
    "If it feels honest, cinematic, and a little uncomfortable in the right way, that's the spark.",
  ].join("\n\n"),
};

function cleanLinks(links) {
  const source = Array.isArray(links) && links.length ? links : defaultSiteSettings.links;
  return source
    .map((link, index) => ({
      id:
        typeof link.id === "string" && link.id.trim()
          ? link.id.trim()
          : `link-${index + 1}`,
      label:
        typeof link.label === "string" && link.label.trim()
          ? link.label.trim()
          : `Link ${index + 1}`,
      url:
        typeof link.url === "string" && link.url.trim()
          ? link.url.trim()
          : "#",
      variant: link.variant === "dark" ? "dark" : "light",
    }))
    .slice(0, 6);
}

function cleanSettings(record = {}) {
  return {
    profilePhotoUrl:
      typeof record.profilePhotoUrl === "string" && record.profilePhotoUrl.trim()
        ? record.profilePhotoUrl.trim()
        : defaultSiteSettings.profilePhotoUrl,
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
    metaTitle:
      typeof record.metaTitle === "string" && record.metaTitle.trim()
        ? record.metaTitle.trim()
        : defaultSiteSettings.metaTitle,
    metaDescription:
      typeof record.metaDescription === "string" && record.metaDescription.trim()
        ? record.metaDescription.trim()
        : defaultSiteSettings.metaDescription,
    videoEyebrow:
      typeof record.videoEyebrow === "string" && record.videoEyebrow.trim()
        ? record.videoEyebrow.trim()
        : defaultSiteSettings.videoEyebrow,
    videoHeadline:
      typeof record.videoHeadline === "string" && record.videoHeadline.trim()
        ? record.videoHeadline.trim()
        : defaultSiteSettings.videoHeadline,
    links: cleanLinks(record.links),
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
