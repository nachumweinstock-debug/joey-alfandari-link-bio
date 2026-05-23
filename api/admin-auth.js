const { isAdminPassword } = require("./admin-password");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { password } = request.body || {};
  if (!isAdminPassword(password)) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  return response.status(200).json({ ok: true });
};
