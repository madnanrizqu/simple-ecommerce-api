/*
  Warnings:

  - A unique constraint covering the columns `[email_verification_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_email_verification_code_key" ON "users"("email_verification_code");
