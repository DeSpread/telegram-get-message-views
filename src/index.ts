import bigInt from "big-integer";
import * as dotenv from "dotenv";
import { Api, TelegramClient, client } from "telegram";
import { StringSession } from "telegram/sessions";
import * as readline from "readline/promises";
import { getTrackingLinks } from "./links.js";

dotenv.config({
  path: [".env.local", ".env"],
});

getTrackingLinks()
  .then((links) => links.filter((link) => link.type === "TELEGRAM"))
  .then(console.log);

// console.log("Hello world!", BOT_TOKEN);

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// (async () => {
//   console.log("Loading interactive example...");
//   const client = new TelegramClient(stringSession, API_ID, API_HASH, {
//     connectionRetries: 5,
//   });
//   await client.start({
//     phoneNumber: () => rl.question("phoneNumber: "),
//     phoneCode: () => rl.question("phoneCode: "),
//     onError: console.error,
//   });
//   console.log("You should now be connected.");

//   const me = await client.getMe();
//   if (me.accessHash) {
//     const channel = await client.invoke(
//       new Api.contacts.ResolveUsername({
//         username: "web3ridge_kr",
//       })
//     );

//     if ("channelId" in channel.peer) {
//       const messages = await client.invoke(
//         new Api.channels.GetMessages({
//           channel: bigInt(channel.peer.channelId),
//           id: [new Api.InputMessageID({ id: 17 })],
//         })
//       );

//       if (
//         "messages" in messages &&
//         messages.messages[0] &&
//         "views" in messages.messages[0]
//       ) {
//         console.log(messages.messages[0].views);
//       }
//     }
//   }
// })();
