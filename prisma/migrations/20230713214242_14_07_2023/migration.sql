-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "address" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL;
