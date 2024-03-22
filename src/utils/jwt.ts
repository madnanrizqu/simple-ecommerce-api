import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";
import { Prisma } from "@prisma/client";

export const signJwt = (
  payload: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions
) => {
  const privateKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null => {
  try {
    const publicKey = Buffer.from(
      config.get<string>(keyName),
      "base64"
    ).toString("ascii");
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};

export const signTokens = async (user: Prisma.usersCreateInput) => {
  const access_token = signJwt({ sub: user.email }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  return { access_token };
};
