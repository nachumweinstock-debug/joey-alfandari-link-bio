const {
  defaultVideoSlots,
  readManifest,
  writeManifest,
} = require("./video-data");
const { isAdminPassword } = require("./admin-password");

async function storePosterIfNeeded(poster, slotId) {
  if (typeof poster !== "string") return undefined;
  if (!poster.startsWith("data:image/")) return poster;

  return "";
}

module.exports = async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const videos = await readManifest();
      response.setHeader("Cache-Control", "no-store");
      return response.status(200).json({ storage: "github", videos });
    }

    if (request.method === "POST") {
      const { action, hidden, id, orderedIds, password, poster, src, title } = request.body || {};

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
            hidden: false,
            order: nextId,
            title: `New video ${nextId}`,
            poster: "",
            src: "",
          },
        ];
        const videos = await writeManifest(next);
        return response.status(200).json({ addedId: nextId, storage: "github", videos });
      }

      if (action === "normalize-posters") {
        const next = await Promise.all(
          current.map(async (slot) => ({
            ...slot,
            poster:
              typeof slot.poster === "string"
                ? await storePosterIfNeeded(slot.poster, slot.id)
                : slot.poster,
          }))
        );
        const videos = await writeManifest(next);
        return response.status(200).json({ storage: "github", videos });
      }

      if (action === "delete") {
        const slotId = Number(id);
        const next = defaultVideoSlots.some((slot) => slot.id === slotId)
          ? [...current.filter((slot) => slot.id !== slotId), { deleted: true, id: slotId }]
          : current.filter((slot) => slot.id !== slotId);
        const videos = await writeManifest(next);
        return response.status(200).json({ storage: "github", videos });
      }

      if (action === "reorder") {
        const orderMap = new Map(
          (Array.isArray(orderedIds) ? orderedIds : []).map((slotId, index) => [
            Number(slotId),
            index + 1,
          ])
        );
        const next = current.map((slot) => ({
          ...slot,
          order: orderMap.get(Number(slot.id)) || slot.order || slot.id,
        }));
        const videos = await writeManifest(next);
        return response.status(200).json({ storage: "github", videos });
      }

      const slotId = Number(id);
      if (!Number.isFinite(slotId) || slotId < 1) {
        return response.status(400).json({ error: "Invalid slot" });
      }

      const nextPoster = await storePosterIfNeeded(poster, slotId);
      const existing = current.find((slot) => slot.id === slotId);
      const next = existing
        ? current.map((slot) =>
            slot.id === slotId
              ? {
                  ...slot,
                  hidden: typeof hidden === "boolean" ? hidden : Boolean(slot.hidden),
                  poster: typeof nextPoster === "string" ? nextPoster : slot.poster,
                  src: typeof src === "string" ? src : slot.src,
                  title: typeof title === "string" ? title : slot.title,
                }
              : slot
          )
        : [
            ...current,
            {
              hidden: typeof hidden === "boolean" ? hidden : false,
              id: slotId,
              order:
                current.reduce(
                  (max, slot) => Math.max(max, Number(slot.order) || Number(slot.id) || 0),
                  0
                ) + 1,
              poster: typeof nextPoster === "string" ? nextPoster : "",
              src: typeof src === "string" ? src : "",
              title: typeof title === "string" ? title : `New video ${slotId}`,
            },
          ];

      const videos = await writeManifest(next);
      return response.status(200).json({ storage: "github", videos });
    }

    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return response.status(500).json({
      error:
        process.env.GITHUB_TOKEN || process.env.GH_TOKEN
          ? "Video storage failed"
          : "Video storage is not configured",
      fallback: defaultVideoSlots,
    });
  }
};
