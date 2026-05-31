const { readJson, writeJson } = require("./github-data");

const settingsPath = "data/site-settings.json";

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
  const source = Array.isArray(links) ? links : defaultSiteSettings.links;
  return source
    .map((link, index) => ({
      id:
        typeof link.id === "string" && link.id.trim()
          ? link.id.trim()
          : `link-${index + 1}`,
      label: typeof link.label === "string" ? link.label : `Link ${index + 1}`,
      url: typeof link.url === "string" ? link.url : "#",
      variant: link.variant === "dark" ? "dark" : "light",
    }))
    .slice(0, 6);
}

function settingString(record, key) {
  return Object.prototype.hasOwnProperty.call(record, key) &&
    typeof record[key] === "string"
    ? record[key]
    : defaultSiteSettings[key];
}

function cleanSettings(record = {}) {
  return {
    profilePhotoUrl: settingString(record, "profilePhotoUrl"),
    handle: settingString(record, "handle"),
    name: settingString(record, "name"),
    tagline: settingString(record, "tagline"),
    metaTitle: settingString(record, "metaTitle"),
    metaDescription: settingString(record, "metaDescription"),
    videoEyebrow: settingString(record, "videoEyebrow"),
    videoHeadline: settingString(record, "videoHeadline"),
    links: cleanLinks(record.links),
    bio: settingString(record, "bio"),
  };
}

async function readSettings() {
  try {
    return cleanSettings(await readJson(settingsPath, defaultSiteSettings));
  } catch (error) {
    if (error?.message?.includes("GitHub")) throw error;
    return defaultSiteSettings;
  }
}

async function writeSettings(record) {
  const settings = cleanSettings(record);
  return writeJson(settingsPath, settings);
}

module.exports = {
  defaultSiteSettings,
  readSettings,
  settingsPath,
  writeSettings,
};
