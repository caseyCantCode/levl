import { APIGuildMember, APIRole, Snowflake } from "discord-api-types/v9";
import Collection from "@discordjs/collection";
import { formatList, getCreatedAt } from "../../structures/utils/functions";
import pagination from "../../structures/utils/pagination";






































export default {
  command: "userinfo",
  aliases: ["ui"],
  description: "Sends user information",
  category: "information",
  exec: async (ctx) => {
    let user: APIGuildMember = await ctx
        .server(ctx.message.guild_id, ctx.message.author.id)
        .getMember(ctx.args.join(" ")),
      avatar: string = ctx.getAvatarURL(user.user),
      currentGuild: { [key: string]: {} } = await ctx.getGuild(
        ctx.message.guild_id
      ),
      json: {[key: string]: []} = await ctx.worker.levlAPI.request(
        `/connections/${user.user.id}?key=${ctx.worker.config.api.key}`
      ),
      formatConnectionName: Function = (name: string) => {
        if (/(youtube|github)/gi.test(name))
          return name
            .replace(/(\b\w)/gi, (w) => w.toUpperCase())
            .replace(/./g, (c, i) => (i === 3 ? c.toUpperCase() : c));
        else return name.replace(/(\b\w)/gi, (w) => w.toUpperCase());
      },
      connections: { [key: string]: { [key: string]: any } } = {
        youtube: {
          emoji: "<:levl_youtube:882810949671718972>",
          link: (_con) => `https://youtube.com/channel/${_con.id}`,
        },
        spotify: {
          emoji: "<:levl_spotify:882811023139143750>",
          link: (_con) => `https://open.spotify.com/user/${_con.id}`,
        },
        twitter: {
          emoji: "<:levl_twitter:882810876665659432>",
          link: (_con) => `https://twitter.com/${_con.name}`,
        },
        github: {
          emoji: "<:levl_github:882811057792499762>",
          link: (_con) => `https://github.com/${_con.name}`,
        },
        reddit: {
          emoji: "<:levl_reddit:882810985331695616>",
          link: (_con) => `https://reddit.com/user/${_con.name}`,
        },
        facebook: {
          emoji: "<:levl_facebook:882810910329159700>",
          link: (_con) => `https://facebook.com/${_con.id}`,
        },
        twitch: {
          emoji: "<:levl_twitch:882810829702057994>",
          link: (_con) => `https://twitch.tv/${_con.name}`,
        },
        steam: {
          emoji: "<:levl_steam:882822410246717450>",
          link: (_con) => `https://steamcommunity.com/profiles/${_con.id}`
        }
      };

    let infoEmbed: {[key: string]: string} = ctx.embed
        .color(ctx.color)
        .title(
          `${
            currentGuild.owner_id === user.user.id
              ? "<:levl_crown:882339081810489394>"
              : ""
          } ${ctx.getTag(user.user)}`
        )
        .thumbnail(avatar)
        .field("ID", `${user.user.id} (<@${user.user.id}>)`)
        .field("Nickname", user.nick || "None")
        .field(
          "Created",
          `<t:${Math.round(
            getCreatedAt(user.user.id).timestamp / 1000
          )}:D> (<t:${Math.round(
            getCreatedAt(user.user.id).timestamp / 1000
          )}:R>)`
        )
        .field(
          "Joined Server",
          `<t:${Math.round(
            new Date(user.joined_at).getTime() / 1000
          )}:D> (<t:${Math.round(
            new Date(user.joined_at).getTime() / 1000
          )}:R>)`
        ),
      connectionEmbed: {} = ctx.embed
        .color(ctx.color)
        .title(
          `${
            currentGuild.owner_id === user.user.id
              ? "<:levl_crown:882339081810489394>"
              : ""
          } ${ctx.getTag(user.user)}`
        )
        .thumbnail(avatar)
        .field(
          "Connections",
          json.connections
            .map((_connection: {[key: string]: string}) =>
              Object.keys(connections).includes(_connection.type)
                ? `**${formatConnectionName(_connection.type)}** ${
                    connections[_connection.type].emoji
                  }\n<:reply:874145869526630480> [${
                    _connection.name
                  }](${connections[_connection.type].link(_connection)})`
                : undefined
            )
            .filter((x: undefined | string) => x)
            .join("\n")
        ),
      embeds: [{}] = [infoEmbed];
    if (json.connections.length) embeds.push(connectionEmbed);
    return await pagination(ctx, ctx.worker.pagination, embeds);
  },
};
