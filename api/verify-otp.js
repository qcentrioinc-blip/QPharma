import { isCompanyEmail, normalizeEmail } from "./_lib/companyEmail.js";
import { json, setCors } from "./_lib/http.js";
import {
  signOtpToken,
  safeEqualHex,
} from "./_lib/otp.js";

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = readBody(req);
    const emailRaw = typeof body.email === "string" ? body.email : "";
    const otpRaw = typeof body.otp === "string" ? body.otp : "";
    const tokenRaw = typeof body.token === "string" ? body.token : "";
    const expiresAtRaw = body.expiresAt;
    const email = normalizeEmail(emailRaw);
    const otp = otpRaw.trim();

    if (!isCompanyEmail(email)) {
      return json(res, 400, {
        error: "Please use a company email address.",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return json(res, 400, { error: "Enter the 6-digit verification code." });
    }

    const expiresAt = Number(expiresAtRaw);
    if (!expiresAt || Date.now() > expiresAt) {
      return json(res, 400, {
        error: "Code expired. Please request a new one.",
      });
    }

    const expectedToken = signOtpToken(otp, email, expiresAt);
    const match = safeEqualHex(tokenRaw, expectedToken);

    if (!match) {
      return json(res, 400, {
        error: "Incorrect code. Please try again.",
      });
    }

    return json(res, 200, { ok: true, verified: true });
  } catch (err) {
    console.error("verify-otp error:", err);
    return json(res, 500, {
      error: "Could not verify code. Please try again.",
    });
  }
}
