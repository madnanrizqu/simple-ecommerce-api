import { CookieOptions, NextFunction, Request, Response } from "express";
import config from "config";
import { generateJson } from "../../utils/genJson";
import { Prisma } from "@prisma/client";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000, // config number * 1 minute
};

export const registerUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(201).json(
      generateJson({
        code: 200,
        message: "In Development",
      })
    );
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          status: "fail",
          message: "Email already exist, please use another email address",
        });
      }
    }
    next(err);
  }
};

export const verifyEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json(
      generateJson({
        code: 200,
        message: "In Development",
      })
    );
  } catch (error) {
    next(error);
  }
};

export const loginUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json(
      generateJson({
        code: 200,
        message: "In Development",
      })
    );
  } catch (error) {
    next(error);
  }
};

export const logoutUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });
    res.cookie("logged_in", "", { maxAge: 1 });

    res.status(200).json({
      status: "success",
    });
  } catch (err: any) {
    next(err);
  }
};
