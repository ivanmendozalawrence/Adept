import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Mailer initialization supporting either generic SMTP_* vars or Gmail app password flow.
// Supported env combinations:
// 1) Generic SMTP: SMTP_HOST, (optional SMTP_PORT), SMTP_USER, SMTP_PASS
// 2) Gmail (simpler): GMAIL_USER, GMAIL_APP_PASSWORD
// Optional: MAIL_FROM overrides From header; otherwise derived from user
let transporter = null;
let transportMethod = null; // track which configuration path we used
let cachedLogoDataUri = null;

function loadLogo() {
  if (cachedLogoDataUri) return cachedLogoDataUri;
  // Try several candidate logo filenames from the frontend
  const candidates = [
    '../../frontend/src/logo-white.png',
    '../../frontend/src/logo-white-text.png',
    '../../frontend/src/logo.png',
    '../../frontend/public/logo512.png',
    '../../frontend/public/logo192.png'
  ];
  for (const rel of candidates) {
    try {
      const p = path.resolve(path.dirname(new URL(import.meta.url).pathname), rel);
      if (fs.existsSync(p)) {
        const b = fs.readFileSync(p);
        const ext = path.extname(p).replace('.', '') || 'png';
        cachedLogoDataUri = `data:image/${ext};base64,${b.toString('base64')}`;
        break;
      }
    } catch(e) { /* ignore */ }
  }
  return cachedLogoDataUri;
}

function buildInvitationHtml({ partnerName, link }) {
  const brand = process.env.MAIL_BRAND_NAME || 'ADEPT';
  const primary = process.env.MAIL_PRIMARY_COLOR || '#1b2559';
  const accent = process.env.MAIL_ACCENT_COLOR || '#4F46E5';
  const bg = process.env.MAIL_BG_COLOR || '#f5f7fb';
  const logo = loadLogo();
  const logoImg = logo ? `<img src="${logo}" alt="${brand} Logo" width="120" style="display:block;margin:0 auto 24px;"/>` : `<h1 style="margin:0 0 24px;font-size:28px;color:${primary};text-align:center;">${brand}</h1>`;
  return `<!DOCTYPE html><html><head><meta charset='utf-8'><title>${brand} Invitation</title></head>
  <body style="margin:0;padding:0;background:${bg};font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#334155;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;padding:48px 56px;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
          <tr><td style="text-align:center;">${logoImg}</td></tr>
          <tr><td style="font-size:20px;font-weight:600;color:${primary};text-align:center;padding-bottom:8px;">You're Invited</td></tr>
          <tr><td style="font-size:15px;line-height:1.55;padding-bottom:28px;text-align:center;">You've been invited to collaborate as a partner: <strong style="color:${primary};">${partnerName}</strong> on the <strong>${brand}</strong> platform. Click the button below to begin onboarding and submit required credentials.</td></tr>
          <tr><td style="text-align:center;padding-bottom:40px;">
            <a href="${link}" style="background:${accent};color:#fff;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:8px;display:inline-block;font-size:15px;">Open Partner Onboarding</a>
          </td></tr>
          <tr><td style="font-size:12px;color:#64748b;line-height:1.4;padding-bottom:8px;">If the button doesn't work, copy and paste this URL into your browser:</td></tr>
          <tr><td style="font-size:12px;color:${accent};word-break:break-all;padding-bottom:32px;">${link}</td></tr>
          <tr><td style="font-size:11px;color:#94a3b8;line-height:1.5;border-top:1px solid #e2e8f0;padding-top:20px;">This invitation link is unique to you. If you did not expect this email, you can ignore it. Do not forward this email—forwarding could allow someone else to use your invitation.</td></tr>
          <tr><td style="font-size:11px;color:#94a3b8;padding-top:12px;">&copy; ${new Date().getFullYear()} ${brand}. All rights reserved.</td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}
export function initMailer() {
  const {
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
    SMTP_SERVICE, // optional e.g. 'gmail'
    GMAIL_USER, GMAIL_APP_PASSWORD,
  } = process.env;

  try {
    if (GMAIL_USER && GMAIL_APP_PASSWORD) {
      // Preferred secure method (requires 2FA + app password)
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
      });
      transportMethod = 'gmail-app-password';
      console.log('[Mail] Gmail (app password) transport configured for user', GMAIL_USER);
    } else if (GMAIL_USER && process.env.GMAIL_PASS) {
      // Legacy / simple password method (may fail if account has 2FA or disallows basic auth)
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: process.env.GMAIL_PASS }
      });
      transportMethod = 'gmail-basic-password';
      console.log('[Mail] Gmail (basic password) transport configured for user', GMAIL_USER);
    } else if (
      GMAIL_USER && process.env.GMAIL_OAUTH_CLIENT_ID && process.env.GMAIL_OAUTH_CLIENT_SECRET && process.env.GMAIL_OAUTH_REFRESH_TOKEN
    ) {
      // OAuth2 flow (no app password). Access token fetched automatically by nodemailer.
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: GMAIL_USER,
          clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
          clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
          accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN // optional pre-fetched
        }
      });
  transportMethod = 'gmail-oauth2';
  console.log('[Mail] Gmail (OAuth2) transport configured for user', GMAIL_USER);
    } else if (SMTP_SERVICE) {
      transporter = nodemailer.createTransport({
        service: SMTP_SERVICE,
        auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
      });
  transportMethod = `service:${SMTP_SERVICE}`;
  console.log(`[Mail] Service transport configured (${SMTP_SERVICE}) user ${SMTP_USER || ''}`);
    } else if (SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465, // auto secure if using 465
        auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
      });
  transportMethod = 'smtp-host';
  console.log('[Mail] SMTP host transport configured', SMTP_HOST, 'user', SMTP_USER || '');
    } else {
      console.warn('[Mail] No mail transport configured; emails will be logged only');
      return;
    }

    transporter.verify()
      .then(() => console.log('[Mail] Transport verified'))
      .catch(e => console.error('[Mail] Transport verify error', e));
  } catch (e) {
    console.error('[Mail] Initialization error', e);
    transporter = null;
  }
}

export function mailerStatus() {
  return {
    configured: !!transporter,
    method: transportMethod,
    from: process.env.MAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER || null
  };
}

export async function sendInvitationEmail({ to, partnerName, link }) {
  const brand = process.env.MAIL_BRAND_NAME || 'ADEPT';
  const from = process.env.MAIL_FROM || `"${brand} (No Reply)" <${process.env.GMAIL_USER || process.env.SMTP_USER || 'no-reply@example.com'}>`;
  const replyTo = process.env.MAIL_REPLY_TO || 'no-reply@invalid.local';
  const subject = `${brand} Invitation: ${partnerName}`;
  const text = `You have been invited to collaborate on ${brand} as partner: ${partnerName}.\n\nOpen the following link to submit credentials:\n${link}\n\nThis link is unique to your invitation.`;
  const html = buildInvitationHtml({ partnerName, link });
  if (!transporter) {
    console.log('[Mail][FAKE] Would send invitation', { to, subject, text, link });
    return { simulated: true };
  }
  return transporter.sendMail({ from, to, replyTo, subject, text, html });
}