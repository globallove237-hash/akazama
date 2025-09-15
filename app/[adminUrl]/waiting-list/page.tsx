import { PrismaClient } from "@/lib/generated/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AdminWaitingListClientPage from "./client-page";

const prisma = new PrismaClient();

export default async function AdminWaitingListPage() {
  const waitingList = await prisma.waitingList.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <AdminWaitingListClientPage initialData={waitingList} />;
}