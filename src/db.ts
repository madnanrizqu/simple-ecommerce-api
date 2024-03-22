import { PrismaClient } from "@prisma/client";
import config from "config";

const dbKey = "databaseUrl";

const prisma = new PrismaClient({
  datasources: { db: { url: config.get<string>(dbKey) } },
});

export default prisma;
