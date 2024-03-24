import { Prisma } from "@prisma/client";
import db from "../../db";

export const getProducts = async (args?: {
  skip?: number;
  take?: number;
  name?: string;
}) => {
  const [count, ...res] = await db.$transaction([
    db.products.count(),
    db.products.findMany({
      skip: args?.skip,
      take: args?.take,
      where: { name: { startsWith: args?.name } },
    }),
  ]);

  return { count, res: res[0] };
};

export const createProduct = async (data: Prisma.productsCreateInput) => {
  return await db.products.create({ data });
};

export const getProductById = async (productId: number) => {
  return await db.products.findUnique({ where: { id: productId } });
};

export const updateProductById = async (
  productId: number,
  data: Prisma.productsUpdateInput
) => {
  return await db.products.update({ where: { id: productId }, data });
};

export const deleteProductById = async (productId: number) => {
  return await db.products.delete({ where: { id: productId } });
};

export const getProductsTotal = async (where?: Prisma.productsWhereInput) => {
  return await db.products.count({ where: where });
};
