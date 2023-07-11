/*
  Warnings:

  - Added the required column `userId` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `States` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "States" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "States" ADD CONSTRAINT "States_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
