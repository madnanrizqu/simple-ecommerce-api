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

// SOFT DELETE: CHANGE READ to READ with WHERE delete=false
prisma.$use(async (params, next) => {
  if (!params.args) {
    params.args = {};
  }

  if (params.action === "findUnique" || params.action === "findFirst") {
    params.action = "findFirst";

    // Add 'deleted' filter
    if (params.args.where) {
      if (params.args.where.deleted == undefined) {
        // Exclude deleted records if they have not been explicitly requested
        params.args.where["deleted"] = false;
      }
    } else {
      params.args["where"] = { deleted: false };
    }
  }

  if (
    params.action === "findFirstOrThrow" ||
    params.action === "findUniqueOrThrow"
  ) {
    if (params.args.where) {
      if (params.args.where.deleted == undefined) {
        // Exclude deleted records if they have not been explicitly requested
        params.args.where["deleted"] = false;
      }
    } else {
      params.args["where"] = { deleted: false };
    }
  }

  if (params.action === "findMany") {
    // Find many queries
    if (params.args.where) {
      if (params.args.where.deleted == undefined) {
        params.args.where["deleted"] = false;
      }
    } else {
      params.args["where"] = { deleted: false };
    }
  }

  return next(params);
});

// SOFT DELETE: CHANGE UPDATE to UPDATE with WHERE delete=false
prisma.$use(async (params, next) => {
  if (params.action == "update") {
    // Add 'deleted' filter
    params.args.where["deleted"] = false;
  }
  if (params.action == "updateMany") {
    if (params.args.where != undefined) {
      params.args.where["deleted"] = false;
    } else {
      params.args["where"] = { deleted: false };
    }
  }
  return next(params);
});

export default prisma;
