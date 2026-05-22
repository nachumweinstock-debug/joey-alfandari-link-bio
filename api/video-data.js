const manifestPath = "brave-spark/videos-manifest.json";

const defaultVideoSlots = [
  {
    id: 1,
    eyebrow: "Intro Reel",
    title: "Upload video one",
    poster: "",
    src: "",
  },
  {
    id: 2,
    eyebrow: "Featured Reel",
    title: "Motivation that hits",
    poster: "",
    src: "",
  },
  {
    id: 3,
    eyebrow: "Story Clip",
    title: "Real talk, sharp cut",
    poster: "",
    src: "",
  },
];

function mergeManifest(records = []) {
  const baseSlots = defaultVideoSlots.map((slot) => {
    const record = records.find((item) => Number(item.id) === slot.id);
    return {
      ...slot,
      ...(record || {}),
      id: slot.id,
    };
  });

  const extraSlots = records
    .filter((item) => !defaultVideoSlots.some((slot) => slot.id === Number(item.id)))
    .map((item) => ({
      eyebrow: "Video",
      title: "New video",
      poster: "",
      src: "",
      ...item,
      id: Number(item.id),
    }))
    .sort((a, b) => a.id - b.id);

  return [...baseSlots, ...extraSlots];
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

  await put(manifestPath, JSON.stringify(manifest, null, 2), {
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
