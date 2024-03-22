import db from "../../db";

export const getUsers = async () => {
  return await db.users.findMany();
};

export const getUserById = async (userId: number) => {
  return await db.users.findUnique({ where: { id: userId } });
};
