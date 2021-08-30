import { Snowflake, Worker } from "discord-rose";
import config from "./config.json";
import flagsMiddleware from "@discord-rose/flags-middleware";
import { LevelContext } from "./structures/context";
import { Event } from "@jpbberry/typed-emitter";
import path from "path";
import handleInteraction from "./events/handleInteractionCreate";
import fetch from "node-fetch";
import { Database } from "./structures/database";
import { createUnparsedSourceFile } from "typescript";
export class LevelWorker extends Worker {
  config = config;
  pagination = {};
  db = new Database(this);
  constructor() {
    super();
    this.once("READY", () => {
      console.log("Ready");
    });
    this.commands.CommandContext = LevelContext;
    this.commands
      .error((ctx, err) => {
        console.log(err);
      })
      .middleware(flagsMiddleware())
      .middleware((ctx) => {
        if (!ctx.command.ownerOnly) return true;
        else return this.isOwner(ctx.author.id);
      })
      .middleware(async (ctx) => {
        if(ctx.command.ownerOnly) return true;

        await this.db.commandDB.createCommand(ctx.command.command, Date.now())
        return true;
      })
      .prefix("l.")
      .load(path.resolve(__dirname, "../dist/commands"));

    this.on("INTERACTION_CREATE", async (data) => {
      if (data.type === 3) {
        await handleInteraction(data, this);
      }
    });
  }
  async isOwner(id: Snowflake) {
    const res = await fetch(
      `http://localhost:${this.config.api.port}/owner/${id}?key=${this.config.api.key}`
    );
    const json = await res.json().catch(() => null);
    return json.owner;
  }
}
new LevelWorker();
