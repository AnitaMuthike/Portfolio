const config = require("../config/env");
const { renderHome } = require("../utils/renderHome");
const { normalizeContactPayload } = require("../utils/validators");

const buckets = new Map();

function getClientKey(req) {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function pruneExpiredBuckets(now, windowMs) {
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.windowStartedAt >= windowMs) {
      buckets.delete(key);
    }
  }
}

function contactRateLimit(req, res, next) {
  const now = Date.now();
  const windowMs = config.security.contactRateLimitWindowMs;
  const maxRequests = config.security.contactRateLimitMax;

  pruneExpiredBuckets(now, windowMs);

  const key = getClientKey(req);
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStartedAt >= windowMs) {
    buckets.set(key, {
      windowStartedAt: now,
      count: 1,
    });
    return next();
  }

  existing.count += 1;

  if (existing.count > maxRequests) {
    const formData = normalizeContactPayload(req.body);
    return renderHome(req, res, {
      statusCode: 429,
      errorMessage:
        "Too many contact attempts. Please wait a few minutes and try again.",
      formData,
    });
  }

  return next();
}

module.exports = {
  contactRateLimit,
};
