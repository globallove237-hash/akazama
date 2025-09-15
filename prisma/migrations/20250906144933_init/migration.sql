-- CreateTable
CREATE TABLE "WaitingList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "age" TEXT,
    "city" TEXT,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "gender" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
