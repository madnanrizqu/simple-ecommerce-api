import db from "../../db";

export const getProducts = async () => {
  return await db.products.findMany();
};
