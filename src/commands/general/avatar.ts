import { APIGuildMember } from "discord-api-types/v9";
import pagination from "../../structures/utils/pagination";
import mentionInterface from "../../interfaces/mentionInterface";
export default{
  command: "avatar",
  aliases: ["pfp", "av"],
  description: "Gets a users avatar",
  exec: async (ctx) => {
    let mention: mentionInterface = ctx.getMention(ctx.args.join(" ")),
      user: APIGuildMember | undefined = await ctx.getGuildMember(
        ctx.worker,
        ctx.message.guild_id,
        mention.error ? ctx.message.author.id : mention.member
      ),
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
