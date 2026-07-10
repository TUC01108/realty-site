import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "hello@mail.yourbigislandrealestate.com";
const TO_YORDANA = "yourbigislandrealestate@gmail.com";

function autoReplyHtml(firstName: string): string {
  return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a1a;"><div style="background:#ff4c4c;padding:32px;text-align:center;"><p style="color:white;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;margin:0;">Your Big Island Real Estate</p></div><div style="padding:40px 32px;"><p style="font-size:16px;line-height:1.7;margin:0 0 20px;">Aloha${firstName ? ` ${firstName}` : ""},</p><p style="font-size:16px;line-height:1.7;margin:0 0 20px;">Thank you for trusting me to help you on your real estate journey. I'm currently reviewing all the information you shared and will be in touch with you soon.</p><p style="font-size:16px;line-height:1.7;margin:0 0 20px;">In the meantime, feel free to follow me on social media to stay up to date with the Hawaii real estate market and learn more through real-time insights, tips, and local market updates <a href="https://www.instagram.com/yourbigislandrealestate" style="color:#ff4c4c;text-decoration:none;">@yourbigislandrealestate</a>.</p><p style="font-size:16px;line-height:1.7;margin:0;">Mahalo nui,<br/><strong>Yordana</strong></p></div><div style="border-top:1px solid #e8e3dc;padding:24px 32px;font-size:11px;color:#999;text-align:center;">Yordana Bolanos Salas &nbsp;·&nbsp; RS-88323 &nbsp;·&nbsp; Coldwell Banker Island Properties<br/>101 Hualalai Street, Hilo, Hawaii 96720</div></div>`;
}

function notificationHtml(subject: string, fields: Record<string, string>): string {
  const rows = Object.entries(fields).map(([k,v]) => `<tr><td style="padding:8px 12px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#999;white-space:nowrap;">${k}</td><td style="padding:8px 12px;font-size:14px;color:#1a1a1a;">${v||"—"}</td></tr>`).join("");
  return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;"><div style="background:#ff4c4c;padding:24px 32px;"><p style="color:white;font-size:18px;margin:0;">${subject}</p></div><div style="padding:32px;"><table style="width:100%;border-collapse:collapse;">${rows}</table></div><div style="border-top:1px solid #e8e3dc;padding:16px 32px;font-size:11px;color:#999;text-align:center;">Sent from yourbigislandrealestate.com</div></div>`;
}

export async function sendContactEmails(data: { name: string; email: string; phone: string; message: string }) {
  const firstName = data.name.split(" ")[0];
  await Promise.all([
    resend.emails.send({ from: FROM, to: TO_YORDANA, subject: `New contact from ${data.name}`, html: notificationHtml("New Contact Form Submission", { Name: data.name, Email: data.email, Phone: data.phone, Message: data.message }) }),
    resend.emails.send({ from: FROM, to: data.email, replyTo: TO_YORDANA, subject: "Aloha! Thank you for reaching out — Your Big Island Real Estate", html: autoReplyHtml(firstName) }),
  ]);
}

export async function sendValuationEmails(data: { name: string; email: string; phone: string; address: string; propertyType: string; notes: string }) {
  const firstName = data.name.split(" ")[0];
  await Promise.all([
    resend.emails.send({ from: FROM, to: TO_YORDANA, subject: `New valuation request from ${data.name}`, html: notificationHtml("New Home Valuation Request", { Name: data.name, Email: data.email, Phone: data.phone, "Property Address": data.address, "Property Type": data.propertyType, Notes: data.notes }) }),
    resend.emails.send({ from: FROM, to: data.email, replyTo: TO_YORDANA, subject: "Aloha! Your valuation request received — Your Big Island Real Estate", html: autoReplyHtml(firstName) }),
  ]);
}
