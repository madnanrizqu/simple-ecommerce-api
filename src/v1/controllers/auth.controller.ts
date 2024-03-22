import { CookieOptions, NextFunction, Request, Response } from "express";
import config from "config";
import { generateJson } from "../../utils/genJson";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createUser, updateUser } from "../services/auth.services";
import { RegisterUserBody, VerifyEmailParams } from "../schemas/auth.schema";
import Email from "../../utils/email";
import AppError from "../../utils/appError";

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
  req: Request<{}, {}, RegisterUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const verifyCode = crypto.randomBytes(32).toString("hex");
    const verificationCode = crypto
      .createHash("sha256")
      .update(verifyCode)
      .digest("hex");

    const user = await createUser({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      email_verification_code: verificationCode,
      contact_number: req.body.contactNumber,
      contact_number_extension: req.body.contactNumberExtension,
      role: req.body.role,
    });

    const redirectUrl = `${config.get<string>(
      "frontendUrl"
    )}/verify_email/${verifyCode}`;
    try {
      const devEmailLink = await new Email(
        user,
        redirectUrl
      ).sendVerificationCode();

      res.status(201).json({
        status: "success",
        message:
          "An email with a verification code has been sent to your email",
        data: {
          devEmailLink: devEmailLink as string,
        },
      });
    } catch (error) {
      await updateUser({ id: user.id }, { email_verification_code: undefined });
      return res.status(500).json({
        status: "error",
        message: "There was an error sending email, please try again",
      });
    }
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          status: "fail",
          message:
            "Email or contact number already exist, please provide another one",
        });
      }
    }
    next(err);
  }
};

export const verifyEmailHandler = async (
  req: Request<VerifyEmailParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationCode = crypto
      .createHash("sha256")
      .update(req.params.emailVerificationCode)
      .digest("hex");

    const user = await updateUser(
      { email_verification_code: verificationCode },
      { email_verified: true, email_verification_code: undefined },
      { email: true }
    );

    if (!user) {
      return next(new AppError(401, "Could not verify email"));
    }

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(403).json({
        status: "fail",
        message: `Verification code is invalid or user doesn't exist`,
      });
    }
    next(err);
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
