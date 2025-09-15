"use server";

import { prisma } from "@/lib/prisma";

export async function updatePaymentScreenshot(paymentId: number, screenshotUrl: string) {
  try {
    const updatedPayment = await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        screenshotPath: screenshotUrl,
      },
    });

    return {
      success: true,
      payment: updatedPayment,
    };
  } catch (error) {
    console.error("Error updating payment screenshot:", error);
    return {
      success: false,
      error: "Failed to update payment screenshot",
    };
  }
}
