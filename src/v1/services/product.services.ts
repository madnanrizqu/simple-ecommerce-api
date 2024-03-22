import { Prisma } from "@prisma/client";
import db from "../../db";

export const getProducts = async () => {
  return await db.products.findMany();
};

export const createProduct = async (data: Prisma.productsCreateInput) => {
  return await db.products.create({ data });
};
