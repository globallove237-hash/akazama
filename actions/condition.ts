"use server";

import { cookies } from "next/headers";

export async function acceptConditions() {
  try {
    const cookieStore = await cookies();
    
    // Set condition acceptance cookie that expires in 1 year
    cookieStore.set("conditions-accepted", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Error accepting conditions:", error);
    return { success: false, error: "Erreur lors de l'acceptation des conditions" };
  }
}

export async function checkConditionsAccepted() {
  try {
    const cookieStore = await cookies();
    const conditionsAccepted = cookieStore.get("conditions-accepted");
    
    return {
      accepted: !!conditionsAccepted && conditionsAccepted.value === "true"
    };
  } catch (error) {
    console.error("Error checking conditions:", error);
    return { accepted: false };
  }
}