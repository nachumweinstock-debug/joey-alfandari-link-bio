const {
  defaultVideoSlots,
  readManifest,
  writeManifest,
} = require("./video-data");

const adminPasswords = new Set(["3907", "joey"]);

function isAdminPassword(value) {
  return adminPasswords.has(String(value || "").trim().toLowerCase());
}

module.exports = async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const videos = await readManifest();
      response.setHeader("Cache-Control", "no-store");
      return response.status(200).json({ storage: "blob", videos });
    }

    if (request.method === "POST") {
      const { action, eyebrow, id, password, poster, src, title } = request.body || {};

      if (!isAdminPassword(password)) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const current = await readManifest();

      if (action === "add") {
        const nextId =
          current.reduce((max, slot) => Math.max(max, Number(slot.id) || 0), 0) + 1;
        const next = [
          ...current,
          {
            id: nextId,
            eyebrow: "Video",
            title: `New video ${nextId}`,
            poster: "",
            src: "",
          },
        ];
        const videos = await writeManifest(next);
        return response.status(200).json({ addedId: nextId, storage: "blob", videos });
      }

      const slotId = Number(id);
      if (!current.some((slot) => slot.id === slotId)) {
        return response.status(400).json({ error: "Invalid slot" });
      }

      const next = current.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              eyebrow: eyebrow || slot.eyebrow,
              poster: typeof poster === "string" ? poster : slot.poster,
              src: typeof src === "string" ? src : slot.src,
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
