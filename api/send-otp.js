import { isCompanyEmail, normalizeEmail } from "./_lib/companyEmail.js";
import { sendOtpEmail } from "./_lib/emailjs.js";
import { json, setCors } from "./_lib/http.js";
import {
  generateOtp,
  signOtpToken,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_TTL_SECONDS,
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
    const firstName =
      typeof body.firstName === "string" ? body.firstName : "";
    const email = normalizeEmail(emailRaw);

    if (!isCompanyEmail(email)) {
      return json(res, 400, {
        error:
          "Please use a company email address. Free domains are not accepted.",
      });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_TTL_SECONDS * 1000;
    const token = signOtpToken(otp, email, expiresAt);

    await sendOtpEmail({ toEmail: email, otp, firstName });

    return json(res, 200, {
      ok: true,
      token,
      expiresAt,
      expiresInSeconds: OTP_TTL_SECONDS,
      retryAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    const message =
      err instanceof Error && err.message.startsWith("EmailJS")
        ? err.message
        : "Could not send verification code. Please try again.";
    return json(res, 500, { error: message });
  }
}
