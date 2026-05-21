const {
  defaultVideoSlots,
  readManifest,
  writeManifest,
} = require("./video-data");

const adminPassword = "3907";

module.exports = async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const videos = await readManifest();
      return response.status(200).json({ storage: "blob", videos });
    }

    if (request.method === "POST") {
      const { eyebrow, id, password, title } = request.body || {};

      if (password !== adminPassword) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const slotId = Number(id);
      if (![1, 2, 3].includes(slotId)) {
        return response.status(400).json({ error: "Invalid slot" });
      }

      const current = await readManifest();
      const next = current.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              eyebrow: eyebrow || slot.eyebrow,
              title: title || slot.title,
            }
          : slot
      );

      const videos = await writeManifest(next);
      return response.status(200).json({ storage: "blob", videos });
    }

    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return response.status(500).json({
      error:
        process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID
          ? "Video storage failed"
          : "Video storage is not configured",
      fallback: defaultVideoSlots,
    });
  }
};
