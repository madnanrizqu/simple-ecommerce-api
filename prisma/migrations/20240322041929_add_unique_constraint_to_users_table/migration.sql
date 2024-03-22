/*
  Warnings:

  - A unique constraint covering the columns `[contact_number,contact_number_extension]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_email_contact_number_contact_number_extension_idx";

-- DropIndex
DROP INDEX "users_email_contact_number_contact_number_extension_key";

-- CreateIndex
CREATE INDEX "users_contact_number_contact_number_extension_idx" ON "users"("contact_number", "contact_number_extension");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_contact_number_contact_number_extension_key" ON "users"("contact_number", "contact_number_extension");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
