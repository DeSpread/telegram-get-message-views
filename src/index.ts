import bigInt from "big-integer";
import * as dotenv from "dotenv";

dotenv.config({
  path: [".env.local", ".env"],
});

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_ID = parseInt(process.env.TELEGRAM_API_ID ?? "-1");
const API_HASH = process.env.TELEGRAM_API_HASH;

if (BOT_TOKEN === undefined) {
  throw new Error(
    "TELEGRAM_BOT_TOKEN is undefined. please check the .env file at project root"
  );
}

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

console.log("Hello world!", BOT_TOKEN);

import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import * as readline from "readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const stringSession = new StringSession(process.env.STRING_SESSION ?? "");

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, API_ID, API_HASH, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: () => rl.question("phoneNumber: "),
    phoneCode: () => rl.question("phoneCode: "),
    onError: console.error,
  });
  console.log("You should now be connected.");

  const me = await client.getMe();
  if (me.accessHash) {
    const channel = await client.invoke(
      new Api.contacts.ResolveUsername({
        username: "web3ridge_kr",
      })
    );

    if ("channelId" in channel.peer) {
      const messages = await client.invoke(
        new Api.channels.GetMessages({
          channel: bigInt(channel.peer.channelId),
          id: [new Api.InputMessageID({ id: 17 })],
        })
      );

      if (
        "messages" in messages &&
        messages.messages[0] &&
        "views" in messages.messages[0]
      ) {
        console.log(messages.messages[0].views);
      }
    }
  }
})();
