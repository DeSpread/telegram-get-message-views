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
import { CustomMessage } from "telegram/tl/custom/message";

const stringSession = new StringSession(""); // fill this later with the value from session.save()

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, API_ID, API_HASH, {
    connectionRetries: 5,
  });
  await client.start({
    botAuthToken: BOT_TOKEN,
  });
  console.log("You should now be connected.");

  const me = await client.getMe();

  const channelId = "-1002103398404";
  const msgIds = [3];

  if (me.accessHash) {
    let views: (Pick<CustomMessage, "id" | "views"> | null)[] = [];

    const messages = await client.invoke(
      new Api.channels.GetMessages({
        channel: bigInt(channelId),
        id: msgIds.map((id) => new Api.InputMessageID({ id: id })),
      })
    );

    if ("messages" in messages) {
      views = messages.messages.map((msg) => {
        if ("views" in msg && typeof msg.views === "number") {
          return { id: msg.id, views: msg.views };
        }

        return null;
      });
    }

    console.log(views);
  }
})();
