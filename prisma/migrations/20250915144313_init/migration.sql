-- CreateTable
CREATE TABLE "public"."WaitingList" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" TEXT,
    "city" TEXT,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "gender" TEXT,
    "bio" TEXT,
    "notes" TEXT,
    "invitedAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" SERIAL NOT NULL,
    "waitingListId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XAF',
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "screenshotPath" TEXT,
    "notes" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentSettings" (
    "id" SERIAL NOT NULL,
    "orangeMoneyNumber" TEXT,
    "mtnMoneyNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitingList_whatsapp_key" ON "public"."WaitingList"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_waitingListId_key" ON "public"."Payment"("waitingListId");

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_waitingListId_fkey" FOREIGN KEY ("waitingListId") REFERENCES "public"."WaitingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
