import { APIGuildMember } from "discord-api-types/v9";
export default {
  command: "help",
  aliases: ["h"],
  description: "Gives multiple resource links including the command page",
  category: "general",
  exec: async (ctx) => {
    let worker: APIGuildMember = await ctx
        .server(ctx.message.guild_id, ctx.message.author.id)
        .getMember(ctx.worker.user.id),
      avatar: string = ctx.getAvatarURL(worker.user),
      currentGuild: {[key: string]: {}} = await ctx.getGuild(ctx.message.guild_id);
    return await ctx.embed
      .color(ctx.color)
      .author("Levl commands", avatar)
      .description(
        `The prefix for \`${currentGuild.name}\` is \`l.\` or \`@levl#0397\``
      )
      .field(
        "Useful Resources",
        `[Command List](${ctx.worker.config.dashboard.site}/commands)\n[Dashboard](${ctx.worker.config.dashboard.site})`
      )
      .send();
  },
};
