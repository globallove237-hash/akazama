"use server";

import { cookies } from "next/headers";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const authSession = cookieStore.get("auth-session");
    
    if (!authSession) {
      return null;
    }
    
    const userId = parseInt(authSession.value);
    const user = await prisma.waitingList.findUnique({
      where: { id: userId },
      include: { payment: true }
    });
    
    return user;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

async function clearAuthSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-session");
    return true;
  } catch (error) {
    console.error("Error clearing auth session:", error);
    return false;
  }
}

export async function checkAuthStatus() {
  try {
    const user = await getAuthenticatedUser();
    return {
      isAuthenticated: !!user,
      user: user ? {
        id: user.id,
        fullName: user.fullName,
        whatsapp: user.whatsapp,
        payment: user.payment
      } : null
    };
  } catch (error) {
    console.error("Error checking auth status:", error);
    return {
      isAuthenticated: false,
      user: null
    };
  }
}

export async function logout() {
  try {
    await clearAuthSession();
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    return { success: false };
  }
}