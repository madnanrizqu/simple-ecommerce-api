-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ACTIVE', 'IN_ACTIVE');

-- CreateEnum
CREATE TYPE "product_status" AS ENUM ('ACTIVE', 'IN_ACTIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "contact_number_extension" TEXT NOT NULL,
    "role" "user_type" NOT NULL,
    "password" TEXT NOT NULL,
    "email_verification_code" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "user_status" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "product_status" NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);
