"use server";

import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function getCustomerServiceNumbers() {
  try {
    const settings = await prisma.paymentSettings.findFirst();
    return {
      success: true,
      data: {
        whatsappNumber: settings?.orangeMoneyNumber || null,
        supportNumber: settings?.mtnMoneyNumber || null
      }
    };
  } catch (error) {
    console.error("Error fetching customer service numbers:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des numéros de service client"
    };
  }
}

export async function updateCustomerServiceNumbers(data: {
  whatsappNumber?: string;
  supportNumber?: string;
}) {
  try {
    const existingSettings = await prisma.paymentSettings.findFirst();
    
    if (existingSettings) {
      await prisma.paymentSettings.update({
        where: { id: existingSettings.id },
        data: {
          orangeMoneyNumber: data.whatsappNumber || existingSettings.orangeMoneyNumber,
          mtnMoneyNumber: data.supportNumber || existingSettings.mtnMoneyNumber,
        }
      });
    } else {
      await prisma.paymentSettings.create({
        data: {
          orangeMoneyNumber: data.whatsappNumber,
          mtnMoneyNumber: data.supportNumber,
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating customer service numbers:", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour des numéros de service client"
    };
  }
}