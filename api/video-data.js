const manifestPath = "brave-spark/videos-manifest.json";

const defaultVideoSlots = [
  {
    id: 1,
    hidden: false,
    order: 1,
    title: "Upload video one",
    poster: "",
    src: "",
  },
  {
    id: 2,
    hidden: false,
    order: 2,
    title: "Motivation that hits",
    poster: "",
    src: "",
  },
  {
    id: 3,
    hidden: false,
    order: 3,
    title: "Real talk, sharp cut",
    poster: "",
    src: "",
  },
];

function mergeManifest(records = []) {
  const deletedIds = new Set(
    records
      .filter((item) => item?.deleted)
      .map((item) => Number(item.id))
      .filter(Boolean)
  );

  const baseSlots = defaultVideoSlots.map((slot) => {
    if (deletedIds.has(slot.id)) return null;
    const record = records.find((item) => Number(item.id) === slot.id);
    const merged = {
      ...slot,
      ...(record || {}),
      id: slot.id,
    };
    delete merged.eyebrow;
    return {
      hidden: Boolean(merged.hidden),
      id: merged.id,
      order: Number(merged.order) || merged.id,
      poster: typeof merged.poster === "string" ? merged.poster : "",
      src: typeof merged.src === "string" ? merged.src : "",
      title: typeof merged.title === "string" ? merged.title : slot.title,
    };
  }).filter(Boolean);

  const extraSlots = records
    .filter((item) => !item?.deleted)
    .filter((item) => !defaultVideoSlots.some((slot) => slot.id === Number(item.id)))
    .map((item) => {
      const id = Number(item.id);
      return {
        hidden: Boolean(item.hidden),
        id,
        order: Number(item.order) || id,
        poster: typeof item.poster === "string" ? item.poster : "",
        src: typeof item.src === "string" ? item.src : "",
        title: typeof item.title === "string" ? item.title : `New video ${id}`,
      };
    });

  return [...baseSlots, ...extraSlots].sort(
    (a, b) => (Number(a.order) || a.id) - (Number(b.order) || b.id)
  );
}

async function readManifest() {
  const { get } = require("@vercel/blob");

  try {
    const result = await get(manifestPath, { access: "public" });
    if (!result?.stream) return defaultVideoSlots;

    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text);
    return mergeManifest(Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    if (error?.message?.includes("No token")) throw error;
    return defaultVideoSlots;
  }
}

async function writeManifest(records) {
  const { put } = require("@vercel/blob");
  const manifest = mergeManifest(records);
  const tombstones = records
    .filter((item) => item?.deleted)
    .map((item) => ({ deleted: true, id: Number(item.id) }))
    .filter((item) => item.id);
  const storedManifest = [...manifest, ...tombstones];

  await put(manifestPath, JSON.stringify(storedManifest, null, 2), {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });

  return manifest;
}

module.exports = {
  defaultVideoSlots,
  manifestPath,
  mergeManifest,
  readManifest,
  writeManifest,
};
