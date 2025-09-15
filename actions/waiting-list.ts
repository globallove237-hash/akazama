"use server";

import { prisma } from "@/lib/prisma";

export async function addToWaitingList(data: {
  fullName: string;
  age?: string;
  city?: string;
  whatsapp: string;
  email?: string;
  gender?: string;
  bio?: string;
}) {
  try {
    console.log("Checking for existing entry with WhatsApp:", data.whatsapp);
    // Check if the user is already in the waiting list
    const existingEntry = await prisma.waitingList.findUnique({
      where: {
        whatsapp: data.whatsapp,
      },
    });

    if (existingEntry) {
      console.log("WhatsApp number already registered:", data.whatsapp);
      return {
        success: false,
        error: "This WhatsApp number is already registered",
      };
    }

    console.log("Creating new entry with data:", data);
    const result = await prisma.waitingList.create({
      data: {
        fullName: data.fullName,
        age: data.age,
        city: data.city,
        whatsapp: data.whatsapp,
        email: data.email,
        gender: data.gender,
        bio: data.bio,
      },
    });

    console.log("Successfully created entry:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error adding to waiting list:", error);
    return { success: false, error: "Failed to add to waiting list" };
  }
}

export async function updateWaitingListEntry(
  id: number,
  data: {
    fullName?: string;
    age?: string | null;
    city?: string | null;
    whatsapp?: string;
    email?: string | null;
    gender?: string | null;
    bio?: string | null;
    notes?: string | null;
    invitedAt?: Date | null;
    joinedAt?: Date | null;
  },
) {
  try {
    console.log("Updating waiting list entry:", { id, data });

    const updatedEntry = await prisma.waitingList.update({
      where: { id },
      data,
    });

    console.log("Successfully updated entry:", updatedEntry);
    return { success: true, data: updatedEntry };
  } catch (error) {
    console.error("Error updating waiting list entry:", error);
    return { success: false, error: "Failed to update waiting list entry" };
  }
}

export async function inviteToApp(id: number) {
  try {
    console.log("Inviting user to app:", id);

    const updatedEntry = await prisma.waitingList.update({
      where: { id },
      data: {
        invitedAt: new Date(),
      },
    });

    console.log("Successfully invited user:", updatedEntry);
    return { success: true, data: updatedEntry };
  } catch (error) {
    console.error("Error inviting user to app:", error);
    return { success: false, error: "Failed to invite user to app" };
  }
}

export async function markAsJoined(id: number) {
  try {
    console.log("Marking user as joined:", id);

    const updatedEntry = await prisma.waitingList.update({
      where: { id },
      data: {
        joinedAt: new Date(),
      },
    });

    console.log("Successfully marked user as joined:", updatedEntry);
    return { success: true, data: updatedEntry };
  } catch (error) {
    console.error("Error marking user as joined:", error);
    return { success: false, error: "Failed to mark user as joined" };
  }
}
