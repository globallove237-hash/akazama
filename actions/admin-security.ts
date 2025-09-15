"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

// Admin secret number - hardcoded as requested
const ADMIN_SECRET_NUMBER = "33780835115";

export async function checkAdminAccess(phoneNumber: string) {
  try {
    if (phoneNumber === ADMIN_SECRET_NUMBER) {
      // Get or create admin login URL
      const adminUrl = await getOrCreateAdminUrl();
      return {
        isAdmin: true,
        adminUrl: adminUrl
      };
    }
    
    return { isAdmin: false };
  } catch (error) {
    console.error("Error checking admin access:", error);
    return { isAdmin: false };
  }
}

// Store admin URL in memory for session persistence
let currentAdminUrl: string | null = null;
let urlGeneratedAt: number = 0;
const URL_LIFETIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function getOrCreateAdminUrl() {
  try {
    const now = Date.now();
    
    // Check if we need to generate a new URL (first time or expired)
    if (!currentAdminUrl || (now - urlGeneratedAt) > URL_LIFETIME) {
      // Check if there's an active admin session
      const sessionResult = await checkAdminSession();
      
      if (sessionResult.isAuthenticated && sessionResult.adminUrl) {
        // Use existing URL from session if admin is logged in
        currentAdminUrl = sessionResult.adminUrl;
        urlGeneratedAt = now;
      } else {
        // Generate new URL only if no active session
        currentAdminUrl = generateRandomUrl();
        urlGeneratedAt = now;
      }
    }
    
    return currentAdminUrl;
  } catch (error) {
    console.error("Error getting admin URL:", error);
    return generateRandomUrl();
  }
}

export async function refreshAdminUrl() {
  try {
    // Force generate new URL (for security rotation)
    currentAdminUrl = generateRandomUrl();
    urlGeneratedAt = Date.now();
    return currentAdminUrl;
  } catch (error) {
    console.error("Error refreshing admin URL:", error);
    return generateRandomUrl();
  }
}

function generateRandomUrl(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function setAdminSession(adminUrl: string) {
  try {
    const cookieStore = await cookies();
    
    // Set admin session cookie
    cookieStore.set("admin-session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    
    // Set admin URL cookie
    cookieStore.set("admin-url", adminUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    
    // Update in-memory storage to match session
    currentAdminUrl = adminUrl;
    urlGeneratedAt = Date.now();
    
    // Schedule URL refresh
    const { scheduleUrlRefresh } = await import("./admin-url-manager");
    await scheduleUrlRefresh();
    
    return { success: true };
  } catch (error) {
    console.error("Error setting admin session:", error);
    return { success: false };
  }
}

export async function checkAdminSession() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-session");
    const adminUrl = cookieStore.get("admin-url");
    
    return {
      isAuthenticated: !!adminSession && adminSession.value === "true",
      adminUrl: adminUrl?.value || null
    };
  } catch (error) {
    console.error("Error checking admin session:", error);
    return { isAuthenticated: false, adminUrl: null };
  }
}