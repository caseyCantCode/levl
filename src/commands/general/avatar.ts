import { APIGuildMember } from "discord-api-types/v9";
import pagination from "../../structures/utils/pagination";
export default {
  command: "avatar",
  aliases: ["pfp", "av"],
  description: "Gets a users avatar",
  category: "general",
  exec: async (ctx) => {
    let user: APIGuildMember = await ctx
        .server(ctx.message.guild_id, ctx.message.author.id)
        .getMember(ctx.args.join(" ")),
      sizes: (string | number)[] = ["Direct", 128, 256, 512, 1024, 2048, 4096],
      types: string[] = ["png", "jpg", "webp"];
    if (ctx.getAvatarURL(user.user, "gif").endsWith("gif")) types.push("gif");
    let avatarEmbeds: {}[] = types.reduce(
      (X, Y) => (
        X.push(
          ctx.embed
            .color(ctx.color)
            .title(`\`${ctx.getTag(user.user)}\'s\` Avatar`)
            .description(
              `\`${Y.toUpperCase()}\` ${sizes
                .map((x) => `[${x}](${ctx.getAvatarURL(user.user, Y, +x)})`)
                .join(" | ")}`
            )
            .image(ctx.getAvatarURL(user.user, Y, 4096))
        ),
        X
      ),
      []
    );
    await pagination(ctx, ctx.worker.pagination, avatarEmbeds);
  },
};
