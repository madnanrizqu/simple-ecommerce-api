import { PrismaClient } from "@prisma/client";
import config from "config";

const dbKey = "databaseUrl";

const prisma = new PrismaClient({
  datasources: { db: { url: config.get<string>(dbKey) } },
});

// SOFT DELETE: CHANGE DELETE to UPDATE delete property
prisma.$use(async (params, next) => {
  if (params.action == "delete") {
    // Delete queries
    // Change action to an update
    params.action = "update";
    params.args["data"] = { deleted: true };
  }
  if (params.action == "deleteMany") {
    // Delete many queries
    params.action = "updateMany";
    if (params.args.data != undefined) {
      params.args.data["deleted"] = true;
    } else {
      params.args["data"] = { deleted: true };
    }
  }

  return next(params);
});

export default prisma;
