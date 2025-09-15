"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { cookies } from "next/headers";

// Create a new Prisma instance specifically for this action
// This helps avoid issues with Prisma client initialization in server actions
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error("Failed to create Prisma client:", error);
  throw new Error("Database connection failed");
}

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
        sameSite: "lax",
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
  } catch (error: any) {
    console.error("Error verifying waiting list entry:", error);
    
    // Handle specific Prisma errors
    if (error?.code === "P1001") {
      return { 
        success: false, 
        error: "Impossible de se connecter à la base de données. Veuillez réessayer plus tard." 
      };
    }
    
    if (error?.message?.includes("PrismaClientInitializationError")) {
      return { 
        success: false, 
        error: "Service temporairement indisponible. Veuillez réessayer plus tard." 
      };
    }
    
    return { 
      success: false, 
      error: "Erreur lors de la vérification. Veuillez réessayer." 
    };
  } finally {
    // Properly disconnect Prisma client
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.warn("Error disconnecting Prisma client:", disconnectError);
    }
  }
}