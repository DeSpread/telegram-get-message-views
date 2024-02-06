import * as dotenv from "dotenv";

dotenv.config({
  path: [".env.local", ".env"],
});

const botToken = process.env.TELEGRAM_BOT_TOKEN;

console.log("Hello world!", botToken);
