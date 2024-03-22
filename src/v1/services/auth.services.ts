import { Prisma, users } from "@prisma/client";
import db from "../../db";

export const createUser = async (input: Prisma.usersCreateInput) => {
  return await db.users.create({
    data: input,
  });
};

export const updateUser = async (
  where: Prisma.usersWhereUniqueInput,
  data: Prisma.usersUpdateInput,
  select?: Prisma.usersSelect
) => {
  return (await db.users.update({ where, data, select })) as users;
};
