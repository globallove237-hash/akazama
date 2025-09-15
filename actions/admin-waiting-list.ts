"use server";

import { prisma } from "@/lib/prisma";

export async function inviteToWhatsApp(id: number) {
  try {
    const updatedEntry = await prisma.waitingList.update({
      where: { id },
      data: {
        invitedAt: new Date(),
      },
    });

    return { success: true, data: updatedEntry };
  } catch (error) {
    console.error("Error updating invitation status:", error);
    return { success: false, error: "Failed to update invitation status" };
  }
}

export async function updateNotes(id: number, notes: string) {
  try {
    const updatedEntry = await prisma.waitingList.update({
      where: { id },
      data: {
        notes,
      },
    });

    return { success: true, data: updatedEntry };
  } catch (error) {
    console.error("Error updating notes:", error);
    return { success: false, error: "Failed to update notes" };
  }
}

export async function deleteEntry(id: number) {
  try {
    await prisma.waitingList.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting entry:", error);
    return { success: false, error: "Failed to delete entry" };
  }
}

export async function markAsJoined(id: number) {
  try {
    const updatedEntry = await prisma.waitingList.update({
      where: { id },
      data: {
        joinedAt: new Date(),
      },
    });

    return { success: true, data: updatedEntry };
  } catch (error) {
    console.error("Error updating join status:", error);
    return { success: false, error: "Failed to update join status" };
  }
}