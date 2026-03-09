import { Client, Receiver } from "@upstash/qstash";

if (process.env["QSTASH_URL"] === undefined) {
  throw new Error(`process.env.QSTASH_URL is undefined`);
}

if (process.env["QSTASH_TOKEN"] === undefined) {
  throw new Error(`process.env.QSTASH_TOKEN is undefined`);
}

if (process.env["QSTASH_CURRENT_SIGNING_KEY"] === undefined) {
  throw new Error(`process.env.QSTASH_CURRENT_SIGNING_KEY is undefined`);
}

if (process.env["QSTASH_NEXT_SIGNING_KEY"] === undefined) {
  throw new Error(`process.env.QSTASH_NEXT_SIGNING_KEY is undefined`);
}

export const QSTASH_URL = process.env["QSTASH_URL"];
export const QSTASH_TOKEN = process.env["QSTASH_TOKEN"];
export const QSTASH_CURRENT_SIGNING_KEY =
  process.env["QSTASH_CURRENT_SIGNING_KEY"];
export const QSTASH_NEXT_SIGNING_KEY = process.env["QSTASH_NEXT_SIGNING_KEY"];

export const qstashClient = new Client({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});

export const qstashReceiver = new Receiver({
  currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: QSTASH_NEXT_SIGNING_KEY,
});
