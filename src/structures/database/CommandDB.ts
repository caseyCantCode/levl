import { Snowflake } from "discord-api-types";
import { Schema, model } from "mongoose";

interface CommandDoc {
  command: string;
  date: number;
}

const commandSchema = new Schema({
  command: { type: String, required: true },
  time: { type: Number },
});

const commandModel = model("commands", commandSchema);

export class CommandDB {
  async getCommands(name?: string): Promise<any> {
    const fromDB = await commandModel.find(name ? { name } : {}).lean();
    return fromDB;
  }
  async getTimeBoundCommands(time: string) {
    const commands = await this.getCommands();
    return commands.filter((e) => Date.now() - e.time < +time);
  }
  async createCommand(command, time: number): Promise<CommandDoc> {
    await commandModel.create({ command, time });
    return await this.getCommands(command);
  }
}
