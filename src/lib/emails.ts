import type { Lang } from "@/lib/i18n";
import { getT } from "@/lib/i18n";

const templates: Record<string, { subject: string; html: (url: string) => string }> = {
  en: {
    subject: "Sign in to QRWing",
    html: (url: string) => `<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f5f5;padding:40px 20px">
<table align="center" width="480" style="background:#fff;border-radius:16px;padding:40px">
<tr><td style="text-align:center;padding-bottom:24px">
<img src="https://qrwing.vercel.app/qrwing-logo.png" alt="QRWing" width="120" style="border-radius:12px"/>
</td></tr>
<tr><td style="text-align:center;padding-bottom:8px">
<h1 style="font-size:22px;margin:0;color:#111">Sign in to QRWing</h1>
</td></tr>
<tr><td style="text-align:center;padding-bottom:24px">
<p style="font-size:14px;color:#666;margin:0;line-height:1.5">Click the button below to sign in to your account.<br/>This link expires in 24 hours.</p>
</td></tr>
<tr><td style="text-align:center;padding-bottom:32px">
<a href="${url}" style="display:inline-block;padding:14px 32px;background:#9333ea;color:#fff;text-decoration:none;border-radius:12px;font-size:15px;font-weight:600">Sign in</a>
</td></tr>
<tr><td style="text-align:center">
<p style="font-size:12px;color:#999;margin:0;line-height:1.4">If you didn\u2019t request this email, you can safely ignore it.<br/>QRWing \u2014 Professional QR Code Generator</p>
</td></tr>
</table></body></html>`,
  },
  es: {
    subject: "Inicia sesi\u00f3n en QRWing",
    html: (url: string) => `<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f5f5;padding:40px 20px">
<table align="center" width="480" style="background:#fff;border-radius:16px;padding:40px">
<tr><td style="text-align:center;padding-bottom:24px">
<img src="https://qrwing.vercel.app/qrwing-logo.png" alt="QRWing" width="120" style="border-radius:12px"/>
</td></tr>
<tr><td style="text-align:center;padding-bottom:8px">
<h1 style="font-size:22px;margin:0;color:#111">Inicia sesi\u00f3n en QRWing</h1>
</td></tr>
<tr><td style="text-align:center;padding-bottom:24px">
<p style="font-size:14px;color:#666;margin:0;line-height:1.5">Haz clic en el bot\u00f3n para iniciar sesi\u00f3n.<br/>Este enlace expira en 24 horas.</p>
</td></tr>
<tr><td style="text-align:center;padding-bottom:32px">
<a href="${url}" style="display:inline-block;padding:14px 32px;background:#9333ea;color:#fff;text-decoration:none;border-radius:12px;font-size:15px;font-weight:600">Iniciar sesi\u00f3n</a>
</td></tr>
<tr><td style="text-align:center">
<p style="font-size:12px;color:#999;margin:0;line-height:1.4">Si no solicitaste este correo, ign\u00f3ralo.<br/>QRWing \u2014 Generador profesional de c\u00f3digos QR</p>
</td></tr>
</table></body></html>`,
  },
};

export function getEmailTemplate(lang: Lang, url: string): { subject: string; html: string } {
  const t = templates[lang] || templates.en;
  return { subject: t.subject, html: t.html(url) };
}
