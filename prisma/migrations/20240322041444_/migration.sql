/*
  Warnings:

  - A unique constraint covering the columns `[email,contact_number,contact_number_extension]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "users_email_contact_number_contact_number_extension_idx" ON "users"("email", "contact_number", "contact_number_extension");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_contact_number_contact_number_extension_key" ON "users"("email", "contact_number", "contact_number_extension");
