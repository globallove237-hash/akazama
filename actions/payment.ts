"use server";

import { prisma } from "@/lib/prisma";

export async function createPayment(data: {
  waitingListId: number;
  amount: number;
  paymentMethod: string;
  phoneNumber: string;
  transactionId?: string;
  screenshotPath?: string;
}) {
  try {
    console.log("Creating payment record:", data);

    // First check if a payment already exists for this waiting list entry
    const existingPayment = await prisma.payment.findUnique({
      where: {
        waitingListId: data.waitingListId,
      },
    });

    if (existingPayment) {
      // If payment already exists, update it instead of creating a new one
      console.log("Payment already exists, updating instead:", existingPayment);

      const updatedPayment = await prisma.payment.update({
        where: {
          id: existingPayment.id,
        },
        data: {
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
          screenshotPath: data.screenshotPath,
          status: "pending", // Reset status to pending for re-submission
          phoneNumber: data.phoneNumber,
        },
      });

      console.log("Payment record updated:", updatedPayment);
      return { success: true, data: updatedPayment };
    }

    // If no payment exists, create a new one
    const payment = await prisma.payment.create({
      data: {
        waitingListId: data.waitingListId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        screenshotPath: data.screenshotPath,
        status: "pending",
        phoneNumber: data.phoneNumber,
      },
    });

    console.log("Payment record created:", payment);
    return { success: true, data: payment };
  } catch (error) {
    console.error("Error creating payment:", error);
    return { success: false, error: "Failed to create payment record" };
  }
}

export async function updatePaymentStatus(
  paymentId: number,
  status: string,
  notes?: string,
) {
  try {
    console.log("Updating payment status:", { paymentId, status, notes });

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        notes,
      },
    });

    console.log("Payment status updated:", payment);
    return { success: true, data: payment };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

export async function getPaymentSettings() {
  try {
    console.log("Fetching payment settings");

    // Try to get existing settings
    let settings = await prisma.paymentSettings.findFirst();

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.paymentSettings.create({
        data: {},
      });
    }

    console.log("Payment settings:", settings);
    return { success: true, data: settings };
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return { success: false, error: "Failed to fetch payment settings" };
  }
}

export async function updatePaymentSettings(data: {
  orangeMoneyNumber?: string;
  mtnMoneyNumber?: string;
}) {
  try {
    console.log("Updating payment settings:", data);

    // Try to get existing settings
    let settings = await prisma.paymentSettings.findFirst();

    // If no settings exist, create them
    if (!settings) {
      settings = await prisma.paymentSettings.create({
        data,
      });
    } else {
      // Update existing settings
      settings = await prisma.paymentSettings.update({
        where: { id: settings.id },
        data,
      });
    }

    console.log("Payment settings updated:", settings);
    return { success: true, data: settings };
  } catch (error) {
    console.error("Error updating payment settings:", error);
    return { success: false, error: "Failed to update payment settings" };
  }
}

export async function updatePaymentScreenshot(
  paymentId: number,
  screenshotPath: string,
) {
  try {
    console.log("Updating payment screenshot:", { paymentId, screenshotPath });

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        screenshotPath,
      },
    });

    console.log("Payment screenshot updated:", payment);
    return { success: true, data: payment };
  } catch (error) {
    console.error("Error updating payment screenshot:", error);
    return { success: false, error: "Failed to update payment screenshot" };
  }
}
