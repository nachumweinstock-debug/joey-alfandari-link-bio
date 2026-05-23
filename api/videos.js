const {
  defaultVideoSlots,
  readManifest,
  writeManifest,
} = require("./video-data");

const adminPasswords = new Set(["3907", "joey"]);

function isAdminPassword(value) {
  return adminPasswords.has(String(value || "").trim().toLowerCase());
}

async function storePosterIfNeeded(poster, slotId) {
  if (typeof poster !== "string") return undefined;
  if (!poster.startsWith("data:image/")) return poster;

  const match = poster.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/);
  if (!match) return "";

  const [, contentType, base64] = match;
  const extension = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  const { put } = require("@vercel/blob");
  const blob = await put(
    `brave-spark/posters/slot-${slotId}-${Date.now()}.${extension}`,
    Buffer.from(base64, "base64"),
    {
      access: "public",
      addRandomSuffix: true,
      contentType,
    }
  );

  return blob.url;
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
            eyebrow: "",
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

      const nextPoster = await storePosterIfNeeded(poster, slotId);
      const next = current.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              eyebrow: typeof eyebrow === "string" ? eyebrow.trim() : slot.eyebrow,
              poster: typeof nextPoster === "string" ? nextPoster : slot.poster,
              src: typeof src === "string" ? src : slot.src,
              title:
                typeof title === "string" && title.trim()
                  ? title.trim()
                  : slot.title,
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
