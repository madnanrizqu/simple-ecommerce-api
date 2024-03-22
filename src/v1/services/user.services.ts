import { Prisma } from "@prisma/client";
import db from "../../db";

export const getUsers = async (args?: {
  skip?: number;
  take?: number;
  name?: string;
}) => {
  return await db.users.findMany({
    skip: args?.skip,
    take: args?.take,
    where: { name: { startsWith: args?.name } },
  });
};

export const getUserById = async (userId: number) => {
  return await db.users.findUnique({ where: { id: userId } });
};

export const updateUserById = async (
  userId: number,
  data: Prisma.usersUpdateInput
) => {
  return await db.users.update({ where: { id: userId }, data });
};

export const deleteUserById = async (userId: number) => {
  return await db.users.delete({ where: { id: userId } });
};
