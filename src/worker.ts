import { Worker } from "discord-rose";
import config from "./config.json";
import flagsMiddleware from "@discord-rose/flags-middleware";
import { LevelContext } from "./structures/context";
import path from "path";
import handleInteraction from "./events/handleInteractionCreate";
export class LevelWorker extends Worker {
  config = config;
  pagination = {};
  constructor() {
    super();
    this.once("READY", () => {
      console.log("Ready");
    });
    this.commands.CommandContext = LevelContext;
    this.commands
      .error((ctx, err) => {
        throw err;
      })
      .middleware(flagsMiddleware())
      .prefix("l.")
      .load(path.resolve(__dirname, "../dist/commands"));

    this.on("INTERACTION_CREATE", async (data) => {
      if (data.type === 3) {
        await handleInteraction(data, this);
      }
    });
  }
}
new LevelWorker();
