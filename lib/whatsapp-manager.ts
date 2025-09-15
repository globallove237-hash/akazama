import { prisma } from "./prisma";

interface WhatsAppNumber {
  id: string;
  number: string;
  label: string;
  isActive: boolean;
}

export async function createWhatsAppLink(message: string): Promise<string> {
  const number = await prisma.paymentSettings.findFirst();
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number?.orangeMoneyNumber}?text=${encodedMessage}`;
}
