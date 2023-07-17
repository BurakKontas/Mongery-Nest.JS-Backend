/*
  Warnings:

  - Added the required column `userId` to the `Minio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Minio" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Minio" ADD CONSTRAINT "Minio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
