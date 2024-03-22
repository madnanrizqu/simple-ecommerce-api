/*
  Warnings:

  - You are about to drop the column `status` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email_verification_code" DROP NOT NULL;
