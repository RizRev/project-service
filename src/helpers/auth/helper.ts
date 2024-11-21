import crypto from "crypto";
import { globalConfig } from "~/config/environment";
// import credentialRepo from "~/repository/pgsql/credential";

const iv = globalConfig("/cryptIV");
const key = globalConfig("/cryptKey");
const algorithm = "aes-256-gcm";

export const encrypt = async (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag();
  return encrypted + ":" + tag.toString("base64");
};

export const decrypt = async (text: string) => {
  const textParts = text.split(":");
  const encryptedText = textParts[0];
  const tag = Buffer.from(textParts[1], "base64");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const checkStatus = async (idAccess: string) => {
  return null;
};
