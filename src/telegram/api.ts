import bigInt from "big-integer";
import { Api } from "telegram";
import { client } from "./client.js";

export async function getMessages(channelId: string, messageIds: number[]) {
  const messages = await client.invoke(
    new Api.channels.GetMessages({
      channel: bigInt(channelId),
      id: [new Api.InputMessageID({ id: 17 })],
    })
  );
}
