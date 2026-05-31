const { readJson, writeJson } = require("./github-data");

const manifestPath = "data/videos-manifest.json";

const defaultVideoSlots = [
  {
    id: 1,
    hidden: false,
    order: 1,
    title: "Add video URL",
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
  try {
    const parsed = await readJson(manifestPath, defaultVideoSlots);
    return mergeManifest(Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    if (error?.message?.includes("GitHub")) throw error;
    return defaultVideoSlots;
  }
}

async function writeManifest(records) {
  const manifest = mergeManifest(records);
  const tombstones = records
    .filter((item) => item?.deleted)
    .map((item) => ({ deleted: true, id: Number(item.id) }))
    .filter((item) => item.id);
  const storedManifest = [...manifest, ...tombstones];
  await writeJson(manifestPath, storedManifest);
  return manifest;
}

module.exports = {
  defaultVideoSlots,
  manifestPath,
  mergeManifest,
  readManifest,
  writeManifest,
};
