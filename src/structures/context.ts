import { APIGuildMember, APIUser, Snowflake } from "discord-api-types";
import { CommandContext, Worker } from "discord-rose";
import mentionInterface from "../interfaces/mentionInterface"
export class LevelContext extends CommandContext {
  color = parseInt("FCA3D9", 16);
  worker = this.worker
  getTag(user: APIUser) {
    return user.username + user.discriminator;
  }
  getAvatarURL(
    user: APIUser,
    type: string = "png",
    size: number = 128
  ): string {
    if (user.avatar)
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
        type ?? (user.avatar.startsWith("a_") ? "gif" : "png")
      }?size=${size}`;
    return `https://cdn.discordapp.com/embed/avatars/${
      Number(user.discriminator) % 5
    }.png`;
  }
  getMention(mentionString: string): mentionInterface {
    if (!mentionString) return { error: true };
    let types = [
      { name: "channel", regex: /<#!?(\d{17,20})>/im },
      { name: "member", regex: /<@!?(\d{17,20})>/im },
      { name: "role", regex: /<@&!?(\d{17,20})>/im },
    ];
    interface typeInterface {
      name: string;
      regex: RegExp;
    }
    return types.reduce(
      (X: Object, Y: typeInterface) => (
        (X[Y.name] = mentionString.match(Y.regex)
          ? mentionString.match(Y.regex)[1]
          : undefined),
        X
      ),
      {}
    );
  }

  async getGuildMember(
    worker: Worker,
    guildID: Snowflake,
    id: Snowflake
  ): Promise<APIGuildMember | undefined> {
    return (
      (await worker.api.request("GET", `/guilds/${guildID}/members/${id}`)) ||
      undefined
    );
  }
}
