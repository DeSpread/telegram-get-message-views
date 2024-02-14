import bigInt from "big-integer";
import { Api } from "telegram";
import { client } from "./client.js";

export async function getMessagesViews(
  channelId: bigInt.BigInteger,
  messageIds: number[]
) {
  const messages = await client.invoke(
    new Api.channels.GetMessages({
      channel: channelId,
      id: messageIds.map((id) => new Api.InputMessageID({ id: id })),
    })
  );

  if (!("messages" in messages)) {
    throw new Error("messages property is not found in GetMessages response");
  }

  return messages.messages.map((msg) => {
    if (!("views" in msg) || msg.views === undefined) {
      throw new Error(
        "views property is not found in GetMessages.messages item"
      );
    }

    return {
      msgId: msg.id,
      views: msg.views,
    };
  });
}

export async function getChannelId(channelName: string) {
  const channel = await client.invoke(
    new Api.contacts.ResolveUsername({
      username: channelName,
    })
  );

  if ("channelId" in channel.peer) {
    return channel.peer.channelId;
  }

  throw {
    channelName: channelName,
    error: new Error("channelId not Found"),
  };
}
