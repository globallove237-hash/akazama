"use server";

import { getCustomerServiceNumbers } from "@/actions/customer-service";

export async function getPricingWhatsAppNumber() {
  try {
    const result = await getCustomerServiceNumbers();

    if (result.success && result.data) {
      // Return the WhatsApp number, fallback to default if not set
      return result.data.whatsappNumber || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "237699697239";
    }

    // Fallback to default number
    return process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "237699697239";
  } catch (error) {
    console.error("Error fetching WhatsApp number for pricing:", error);
    // Fallback to default number
    return process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "237699697239";
  }
}
