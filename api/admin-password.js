function isAdminPassword(value) {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password) && String(value || "") === password;
}

module.exports = { isAdminPassword };
