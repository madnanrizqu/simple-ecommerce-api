import { Prisma } from "@prisma/client";
import db from "../../db";

export const getUsers = async (args?: {
  skip?: number;
  take?: number;
  name?: string;
}) => {
  const [count, res] = await db.$transaction([
    db.users.count(),
    db.users.findMany({
      skip: args?.skip,
      take: args?.take,
      where: { name: { startsWith: args?.name } },
      select: {
        id: true,
        contact_number: true,
        contact_number_extension: true,
        deleted: true,
        email: true,
        name: true,
        role: true,
      },
    }),
  ]);

  return { count, res };
};

export const getUsersTotal = async (where?: Prisma.usersWhereInput) => {
  return await db.users.count({ where: where });
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
