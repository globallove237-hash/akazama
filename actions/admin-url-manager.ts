"use server";

import { cookies } from "next/headers";

// URL refresh management
export async function scheduleUrlRefresh() {
  try {
    const cookieStore = await cookies();
    
    // Set URL refresh schedule (every 24 hours)
    const nextRefresh = Date.now() + (24 * 60 * 60 * 1000);
    cookieStore.set("admin-url-refresh", nextRefresh.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 2, // 48 hours
      path: "/",
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error scheduling URL refresh:", error);
    return { success: false };
  }
}

export async function checkUrlRefreshNeeded() {
  try {
    const cookieStore = await cookies();
    const refreshSchedule = cookieStore.get("admin-url-refresh");
    
    if (!refreshSchedule) {
      return { needsRefresh: false };
    }
    
    const scheduledTime = parseInt(refreshSchedule.value);
    const now = Date.now();
    
    return { 
      needsRefresh: now >= scheduledTime,
      timeUntilRefresh: Math.max(0, scheduledTime - now)
    };
  } catch (error) {
    console.error("Error checking URL refresh:", error);
    return { needsRefresh: false };
  }
}

export async function updateAdminUrlInSession(newUrl: string) {
  try {
    const cookieStore = await cookies();
    
    // Update admin URL in session
    cookieStore.set("admin-url", newUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    
    // Schedule next refresh
    await scheduleUrlRefresh();
    
    return { success: true };
  } catch (error) {
    console.error("Error updating admin URL in session:", error);
    return { success: false };
  }
}