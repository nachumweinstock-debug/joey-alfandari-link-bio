const { handleUpload } = require("@vercel/blob/client");
const { readManifest, writeManifest } = require("./video-data");

const adminPassword = "3907";

module.exports = async function handler(request, response) {
  try {
    const jsonResponse = await handleUpload({
      request,
      body: request.body,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const payload = JSON.parse(clientPayload || "{}");

        if (payload.password !== adminPassword) {
          throw new Error("Unauthorized");
        }

        const slotId = Number(payload.id);
        const current = await readManifest();
        if (!current.some((slot) => slot.id === slotId)) {
          throw new Error("Invalid slot");
        }

        return {
          allowedContentTypes: ["video/*"],
          maximumSizeInBytes: 1024 * 1024 * 500,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            eyebrow: payload.eyebrow,
            id: slotId,
            title: payload.title,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload || "{}");
        const slotId = Number(payload.id);
        const current = await readManifest();
        const next = current.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                eyebrow: payload.eyebrow || slot.eyebrow,
                src: blob.url,
                title: payload.title || slot.title,
              }
            : slot
        );

        await writeManifest(next);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({
      error: error?.message || "Upload failed",
    });
  }
};
