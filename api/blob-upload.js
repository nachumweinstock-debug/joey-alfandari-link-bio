const { handleUpload } = require("@vercel/blob/client");
const { isAdminPassword } = require("./admin-password");

module.exports = async function handler(request, response) {
  try {
    const jsonResponse = await handleUpload({
      request,
      body: request.body,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const payload = JSON.parse(clientPayload || "{}");

        if (!isAdminPassword(payload.password)) {
          throw new Error("Unauthorized");
        }

        const slotId = Number(payload.id);
        if (!Number.isFinite(slotId) || slotId < 1) {
          throw new Error("Invalid slot");
        }

        return {
          allowedContentTypes: ["video/*"],
          maximumSizeInBytes: 1024 * 1024 * 500,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            id: slotId,
            title: payload.title,
          }),
        };
      },
      onUploadCompleted: async () => {},
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({
      error: error?.message || "Upload failed",
    });
  }
};
