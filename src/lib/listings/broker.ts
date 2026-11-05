export const DISPLAY_BROKER = {
  brokerage: "Coldwell Banker Island Properties",
  agent: "Yordana Bolanos Salas",
  license: "RS-88323",
  phone: "808.642.4933",
  phoneHref: "tel:+18086424933",
  email: "yourbigislandrealestate@gmail.com",
  street: "101 Hualalai Street",
  cityLine: "Hilo, Hawaii 96720",
} as const;

export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return `tel:${digits}`;
}
