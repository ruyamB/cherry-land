import nodemailer from "nodemailer";

/* Shared thank-you mailer — used by the local API and Vercel functions.
   Credentials come from env only. Never import this from client code. */

let transporter = null;
function mailer() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });
  }
  return transporter;
}

const LOGO_URL = "https://cherryagents.vercel.app/cherry-logo.png";

export function welcomeTemplate({ invite, position }) {
  const inviteUrl =
    `https://cherryagents.vercel.app/thank-you?invite=${encodeURIComponent(invite)}` +
    (typeof position === "number" ? `&pos=${position}` : "");
  const subject = `You're on the Cherry waitlist — ${invite}`;
  const text =
    `Thank you for trusting Cherry.\n\n` +
    `Your tester invite: ${invite}\n` +
    (typeof position === "number" ? `Your place in line: #${position}\n` : "") +
    `\nView your invite: ${inviteUrl}\n\n` +
    `One pack, one task, fully cited.\n\n` +
    `You're receiving this because you joined the Cherry waitlist at cherryagents.vercel.app.`;
  const html = `<!doctype html><html><body style="margin:0;background:#FFFBF9;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 20px;">
<img src="${LOGO_URL}" alt="Cherry" style="height:44px;" />
<h1 style="color:#2A1215;font-size:28px;margin:24px 0 8px;">Thank you for trusting Cherry.</h1>
<p style="color:#5b4a4e;font-size:15px;line-height:1.6;">You're on the waitlist. One pack, one task, fully cited — here's your tester invite:</p>
<div style="background:#2A1215;border-radius:14px;padding:20px;text-align:center;margin:24px 0;">
<div style="color:#ffffff;font-family:monospace;font-size:26px;letter-spacing:6px;">${invite}</div>
${typeof position === "number" ? `<div style="color:#FFD9DE;font-size:13px;margin-top:8px;">#${position} in line</div>` : ""}
</div>
<a href="${inviteUrl}" style="display:inline-block;background:#D14B4B;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 28px;border-radius:999px;">View your invite</a>
<p style="color:#8A7377;font-size:12px;margin-top:32px;">You're receiving this because you joined the Cherry waitlist at cherryagents.vercel.app.</p>
</div></body></html>`;
  return { subject, text, html };
}

/* Returns true on sent, false on any failure (never throws). */
export async function sendWelcomeEmail({ to, invite, position }) {
  try {
    if (!process.env.ZOHO_USER || !process.env.ZOHO_PASS) {
      console.error("mailer: missing ZOHO_USER / ZOHO_PASS");
      return false;
    }
    const { subject, text, html } = welcomeTemplate({ invite, position });
    await mailer().sendMail({
      from: `"Cherry" <${process.env.ZOHO_USER}>`,
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (e) {
    console.error("mailer error:", e.message);
    return false;
  }
}
