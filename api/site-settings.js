const {
  defaultSiteSettings,
  readSettings,
  writeSettings,
} = require("./site-data");
const { isAdminPassword } = require("./admin-password");

module.exports = async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const settings = await readSettings();
      response.setHeader("Cache-Control", "no-store");
      return response.status(200).json({ settings });
    }

    if (request.method === "POST") {
      const {
        bio,
        handle,
        links,
        metaDescription,
        metaTitle,
        name,
        password,
        profilePhotoUrl,
        tagline,
        videoEyebrow,
        videoHeadline,
      } = request.body || {};

      if (!isAdminPassword(password)) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const settings = await writeSettings({
        bio,
        handle,
        links,
        metaDescription,
        metaTitle,
        name,
        profilePhotoUrl,
        tagline,
        videoEyebrow,
        videoHeadline,
      });
      return response.status(200).json({ settings });
    }

    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return response.status(500).json({
      error:
        process.env.GITHUB_TOKEN || process.env.GH_TOKEN
          ? "Site settings failed"
          : "Site settings storage is not configured",
      fallback: defaultSiteSettings,
    });
  }
};
