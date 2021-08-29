import { APIGuildMember, APIUser, Snowflake, APIRole } from "discord-api-types";
import { CommandContext, Worker } from "discord-rose";
import Collection from "@discordjs/collection";
export class LevelContext extends CommandContext {
  color = parseInt("FCA3D9", 16);
  worker = this.worker;
  getTag(user: APIUser) {
    return user.username + "#" + user.discriminator;
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

  server(worker: Worker, guildID: Snowflake, author: Snowflake): {} {
    return {
      getMember: async (query: string): Promise<APIGuildMember> => {
        let guildMembers: Collection<Snowflake, APIGuildMember> =
          await worker.getMembers(guildID);
        return query
          ? guildMembers.get(query.replace(/[<@​!?>]/g, "")) ||
              guildMembers.find((m) =>
                [m.user.username, m.nick].some((e) =>
                  e?.toLowerCase().includes(query.toLowerCase())
                )
              )
          : guildMembers.get(author);
      },
      getRole: async (query: string) => {
        let guildRoles: Collection<Snowflake, APIRole> =
          worker.guildRoles.get(guildID);
        return query
          ? guildRoles.get(query.replace(/[<@​&>]/g, "")) ||
              guildRoles.find((x) =>
                x?.name.toLowerCase().includes(query.toLowerCase())
              )
          : undefined;
      },
    };
  }
}
