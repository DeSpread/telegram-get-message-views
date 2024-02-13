import { resolve } from "path";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_ID = parseInt(process.env.TELEGRAM_API_ID ?? "-1");
const API_HASH = process.env.TELEGRAM_API_HASH;
const STRING_SESSION = process.env.TELEGRAM_STRING_SESSION;
const PHONE_NUMBER = process.env.TELEGRAM_PHONE_NUMBER;

// if (BOT_TOKEN === undefined) {
//   throw new Error(
//     "TELEGRAM_BOT_TOKEN is undefined. please check the .env file at project root"
//   );
// }

const stringSession = new StringSession(STRING_SESSION ?? "");

async function initClient() {
  if (!API_ID) {
    throw new Error(
      "TELEGRAM_API_ID is undefined. please check the .env file at project root"
    );
  }

  if (!API_HASH) {
    throw new Error(
      "TELEGRAM_API_HASH is undefined. please check the .env file at project root"
    );
  }

  if (!STRING_SESSION) {
    throw new Error(
      "TELEGRAM_STRING_SESSION is undefined. please check the .env file at project root"
    );
  }

  if (!PHONE_NUMBER) {
    throw new Error(
      "TELEGRAM_PHONE_NUMBER is undefined. please check the .env file at project root"
    );
  }

  const client = new TelegramClient(stringSession, API_ID, API_HASH, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: PHONE_NUMBER,
    phoneCode: async () => "000",
    onError: console.error,
  });

  console.log("You should now be connected.");

  return client;
}

export const client = await initClient();
