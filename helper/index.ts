import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET || "secret0020i90000000e";

export const random = () => crypto.randomBytes(128).toString("base64");

export const maskPassword = (salt: string, password: string) => {
    return crypto.createHmac("sha256", [salt, password].join("/")).update(secret).digest("hex");
};

