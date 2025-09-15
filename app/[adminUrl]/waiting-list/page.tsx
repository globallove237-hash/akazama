import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AdminWaitingListClientPage from "./client-page";

export default async function AdminWaitingListPage() {
  const waitingList = await prisma.waitingList.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <AdminWaitingListClientPage initialData={waitingList} />;
}