"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function verifyWaitingListEntry(whatsapp: string) {
  try {
    console.log("Verifying WhatsApp number:", whatsapp);

    // Check if the user is in the waiting list
    const entry = await prisma.waitingList.findUnique({
      where: {
        whatsapp: whatsapp,
      },
    });

    if (entry) {
      console.log("WhatsApp number found in waiting list:", entry.id);

      // Create authentication session by setting a cookie
      const cookieStore = await cookies();
      cookieStore.set("auth-session", entry.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return {
        success: true,
        data: { id: entry.id, fullName: entry.fullName },
      };
    } else {
      console.log("WhatsApp number not found in waiting list");
      return {
        success: false,
        error: "Numéro non trouvé dans la liste d'attente",
      };
    }
  } catch (error) {
    console.error("Error verifying waiting list entry:", error);
    return { success: false, error: "Erreur lors de la vérification" };
  }
}
