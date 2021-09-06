import pagination from "../../structures/utils/pagination";
import { formatList, getCreatedAt } from "../../structures/utils/functions";
import Permissions from "../../structures/utils/permissions";
export default {
  command: "role",
  aliases: ["r"],
  description: "Allows you to view all roles or get info on a role",
  category: "information",
  subcommands: [
    {
      command: "list",
      aliases: ["l"],
      description: "Allows you to list all roles in the sever",
      exec: async (ctx) => {
        let roles = await ctx.worker.api.request(
          "GET",
          `/guilds/${ctx.message.guild_id}/roles`
        );
        roles = roles
          .sort((a, b) => b.position - a.position)
          .map((x) => `<@&${x.id}>`);
        roles = Array.from(
          {
            length: Math.ceil(roles.length / 25),
          },
          (_, i: number) => roles.slice(i * 25, i * 25 + 25)
        );
        roles = roles.map((x) =>
          ctx.embed.color(ctx.color).title("Roles").description(formatList(x))
        );
        await pagination(ctx, ctx.worker.pagination, roles);
      },
    },
    {
      command: "info",
      aliases: ["i"],
      description: "Allows you to get info on a role in the server",
      exec: async (ctx) => {
        let role = await ctx
          .server(ctx.message.guild_id, ctx.message.author.id)
          .getRole(ctx.args.slice(1).join(" "));
        if (!role) return await ctx.reply("Please include a valid role!");
        let getType = (type: boolean): string => {
          return type ? "Yes" : "No";
        };
        let infoEmbed = ctx.embed
            .color(ctx.color)
            .title(role.name)
            .field("ID", `${role.id} (<@&${role.id}>)`, true)
            .field(
              "Created",
              `<t:${Math.round(
                getCreatedAt(role.id).timestamp / 1000
              )}:D> (<t:${Math.round(
                getCreatedAt(role.id).timestamp / 1000
              )}:R>)`
            )
            .field(
              "Position",
              `${role.position} / ${
                (
                  await ctx.worker.api.request(
                    "GET",
                    `/guilds/${ctx.message.guild_id}/roles`
                  )
                ).length
              }`,
              true
            )
            .field("Hex Color", "#" + role.color.toString(16), true)
            .field("Permissions", role.permissions, true)
            .field("Hoisted", getType(role.hoisted), true)
            .field("Mentionable", getType(role.mentionable), true)
            .field("Managed", getType(role.managed), true),
          permissionEmbed = ctx.embed
            .color(ctx.color)
            .title(`Permissions for ${role.name}`);
        let permissions = new Permissions(),
          bitfields = permissions.formattedFlags;
        Object.entries(
          Object.keys(permissions.flags).reduce(
            (x, y) => (
              (x[y] = permissions.getFlags(role.permissions).includes(y)), x
            ),
            {}
          )
        )
          .reduce(
            (acc, current) => (
              acc[bitfields[current[0]] <= 1 ? bitfields[current[0]] : 2].push(
                `${
                  current[1]
                    ? "<:levl_check:881435831141806151>"
                    : "<:levl_cross:881435789601435748>"
                } | \`${current[0]
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/(\b\w)/gi, (w) => w.toUpperCase())
                  .replace(/VAD|TTS/i, (i) => i.toUpperCase())}\``
              ),
              acc
            ),
            [[], [], []]
          )
          .map((e, c) => [
            `• __${
              c === 0
                ? "General"
                : c === 1
                ? "Text"
                : c === 2
                ? "Voice"
                : "Unknown"
            } Permissions__`,
            e
              .sort((a, b) => a.split("`")[1].localeCompare(b.split("`")[1]))
              .join("\n"),
          ])
          .map((field) => permissionEmbed.field(field[0], field[1], true));
        return await pagination(ctx, ctx.worker.pagination, [
          infoEmbed,
          permissionEmbed,
        ]);
      },
    },
  ],
  exec: async function (ctx) {
    let subcommand = ctx.args[0],
      foundSubcommand = this.subcommands.find(
        (x) =>
          (subcommand && x.command === subcommand.toLowerCase()) ||
          (x.aliases && x.aliases.includes(subcommand.toLowerCase()))
      );
    if (!subcommand || !foundSubcommand)
      return await ctx.reply(
        `Invalid subcommand! Valid subcommands are ${formatList(
          this.subcommands.map((x) => "`" + x.command + "`")
        )}`
      );
    await foundSubcommand.exec(ctx);
  },
};
