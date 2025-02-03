/*
  Warnings:

  - The `status` column on the `group_invite` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `group_member` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "GroupInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GROUP_INVITE', 'CHALLENGE_COMPLETED', 'VALIDATION_RECEIVED', 'PERIOD_STARTED', 'MEMBER_JOINED');

-- DropIndex
DROP INDEX "group_invite_groupId_email_key";

-- AlterTable
ALTER TABLE "group_invite" ADD COLUMN     "role" "GroupRole" NOT NULL DEFAULT 'MEMBER',
DROP COLUMN "status",
ADD COLUMN     "status" "GroupInviteStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "group_member" DROP COLUMN "role",
ADD COLUMN     "role" "GroupRole" NOT NULL DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_userId_read_createdAt_idx" ON "notification"("userId", "read", "createdAt");

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
