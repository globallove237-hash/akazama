import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Test the connection by counting entries in the waiting list
  const count = await prisma.waitingList.count();
  console.log(`Database connection successful. Found ${count} entries in the waiting list.`);
  
  // Get the first 5 entries
  const entries = await prisma.waitingList.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  
  console.log("Recent entries:", entries);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });