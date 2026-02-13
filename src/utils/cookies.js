function parseCookies(cookieHeader = "") {
  const cookies = {};

  if (!cookieHeader) {
    return cookies;
  }

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rawValueParts] = part.split("=");
    const name = (rawName || "").trim();
    if (!name) {
      continue;
    }

    const rawValue = rawValueParts.join("=").trim();
    try {
      cookies[name] = decodeURIComponent(rawValue);
    } catch {
      cookies[name] = rawValue;
    }
  }

  return cookies;
}

module.exports = {
  parseCookies,
};
