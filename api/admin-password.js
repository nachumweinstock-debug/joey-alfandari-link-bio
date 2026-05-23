function isAdminPassword(value) {
  const passwords = String(process.env.ADMIN_PASSWORD || "")
    .split(",")
    .map((password) => password.trim())
    .filter(Boolean);

  return passwords.includes(String(value || "").trim());
}

module.exports = { isAdminPassword };
