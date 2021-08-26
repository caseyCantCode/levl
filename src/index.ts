import { Master } from "discord-rose";
import path from "path";
import config from "./config.json";
const master: Master = new Master(path.resolve("dist/" + "worker.js"), {
  token: config.bot.token,
  shards: "auto",
  intents: 32767,
  cache: {
    voiceStates: false,
    members: false,
    messages: true,
    channels: true,
    self: true,
    guilds: true,
    roles: true,
    users: false,
  },
});
master.start();
master.spawnProcess("API", path.resolve("dist/" + "api/index.js"));
