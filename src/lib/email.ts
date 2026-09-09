import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "hello@mail.yourbigislandrealestate.com";
const TO = "yourbigislandrealestate@gmail.com";
function autoReply(name: string): string {
  const first = name.split(" ")[0];
  return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;"><div style="background:#ff4c4c;padding:32px;text-align:center;"><p style="color:white;font-size:13px;letter-spacing:0.15em;text-transform:uppercase;margin:0;">Your Big Island Real Estate</p></div><div style="padding:40px 32px;"><p style="font-size:16px;line-height:1.7;margin:0 0 20px;">Aloha${first ? ` ${first}` : ""},</p><p style="font-size:16px;line-height:1.7;margin:0 0 20px;">Thank you for trusting me to help you on your real estate journey. I\'m currently reviewing all the information you shared and will be in touch with you soon.</p><p style="font-size:16px;line-height:1.7;margin:0 0 20px;">In the meantime, feel free to follow me on social media <a href="https://www.instagram.com/yourbigislandrealestate" style="color:#ff4c4c;">@yourbigislandrealestate</a>.</p><p style="font-size:16px;line-height:1.7;margin:0;">Mahalo nui,<br/><strong>Yordana</strong></p></div><div style="border-top:1px solid #e8e3dc;padding:24px 32px;font-size:11px;color:#999;text-align:center;">Yordana Bolanos Salas · RS-88323 · Coldwell Banker Island Properties</div></div>`;
}
function notification(subject: string, fields: Record<string,string>): string {
  const rows = Object.entries(fields).map(([k,v]) => `<tr><td style="padding:8px 12px;font-size:12px;text-transform:uppercase;color:#999;">${k}</td><td style="padding:8px 12px;font-size:14px;">${v||"—"}</td></tr>`).join("");
  return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;"><div style="background:#ff4c4c;padding:24px 32px;"><p style="color:white;font-size:18px;margin:0;">${subject}</p></div><div style="padding:32px;"><table style="width:100%;border-collapse:collapse;">${rows}</table></div></div>`;
}
export async function sendContactEmails(d: {name:string;email:string;phone:string;message:string}) {
  await Promise.all([
    resend.emails.send({ from: FROM, to: TO, subject: `New contact from ${d.name}`, html: notification("New Contact Submission", { Name:d.name, Email:d.email, Phone:d.phone, Message:d.message }) }),
    resend.emails.send({ from: FROM, to: d.email, replyTo: TO, subject: "Aloha! Thank you for reaching out — Your Big Island Real Estate", html: autoReply(d.name) }),
  ]);
}
export async function sendValuationEmails(d: {name:string;email:string;phone:string;address:string;propertyType:string;notes:string}) {
  await Promise.all([
    resend.emails.send({ from: FROM, to: TO, subject: `New valuation request from ${d.name}`, html: notification("New Home Valuation Request", { Name:d.name, Email:d.email, Phone:d.phone, "Property Address":d.address, "Property Type":d.propertyType, Notes:d.notes }) }),
    resend.emails.send({ from: FROM, to: d.email, replyTo: TO, subject: "Aloha! Your valuation request received — Your Big Island Real Estate", html: autoReply(d.name) }),
  ]);
}
