import { PrismaClient } from "@/lib/generated/prisma";
import AdminPaymentClientPage from "./client-page";

const prisma = new PrismaClient();

export default async function AdminPaymentPage() {
  const payments = await prisma.payment.findMany({
    include: {
      waitingList: {
        select: {
          id: true,
          fullName: true,
          whatsapp: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <AdminPaymentClientPage initialPayments={payments} />;
}