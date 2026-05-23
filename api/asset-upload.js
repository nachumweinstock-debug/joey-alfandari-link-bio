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

        return {
          allowedContentTypes: ["image/*"],
          maximumSizeInBytes: 1024 * 1024 * 15,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({
      error: error?.message || "Asset upload failed",
    });
  }
};
