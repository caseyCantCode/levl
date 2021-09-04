import { APIGuildMember, APIRole, Snowflake } from "discord-api-types/v9";
import Collection from "@discordjs/collection";
import pagination from "../../structures/utils/pagination";
interface ShardStat {
  guilds: number;
  channels: number;
  roles: number;
  ping: string;
}
interface Stats {
  id: Snowflake;
  shards: ShardStat[];
  guilds: number;
  channels: number;
  roles: number;
}
export default {
  command: "stats",
  aliases: ["meta"],
  description: "Sends bot statistics",
  category: "information",
  exec: async (ctx) => {
    let currentShard: number = ctx.guild
        ? Number(
            (BigInt(ctx.guild.id) >> BigInt(22)) %
              BigInt(ctx.worker.options.shards)
          )
        : 1,
      stats: Stats[] = (await ctx.worker.comms.broadcastEval(
        `const stats = {
          id: worker.comms.id,
          shards: worker.shards.reduce((a, shard) => {
            a[shard.id] = worker.guilds.reduce((b, guild) => {
              if (Number((BigInt(guild.id) >> BigInt(22)) % BigInt(worker.options.shards)) !== shard.id) return b
              return {
                ping: (worker.shards.get(shard.id)?.ping ?? '?').toString(),
                guilds: b.guilds + 1,
                roles: b.roles + (worker.guildRoles.get(guild.id)?.size ?? 0)
              }
            }, { ping: '', guilds: 0, channels: 0, roles: 0 })
            return a
          }, {}),
          guilds: worker.guilds.size,
          roles: worker.guildRoles.reduce((a, b) => a + b.size, 0)
        }; stats`
      )) as unknown as Stats[],
      databasePing: number = Date.now();
    await ctx.worker.db.commandDB.getCommands();
    databasePing = Date.now() - databasePing;
    let worker: APIGuildMember = await ctx
        .server(ctx.message.guild_id, ctx.message.author.id)
        .getMember(ctx.worker.user.id),
      avatar = ctx.getAvatarURL(worker.user);
    return await ctx.embed
      .color(ctx.color)
      .author("Levl Stats", avatar)
      .field(
        "Caching",
        `Guilds | **${ctx.worker.guilds.size.toLocaleString()}**\nRoles | **${Array.from(
          ctx.worker.guildRoles.values()
        )
          .reduce(
            (x: number, y: Collection<Snowflake, APIRole>) => (x += y.size),
            0
          )
          .toLocaleString()}**`,
        true
      )
      .field(
        "Made with",
        `Discord Rose | **1.5.1**\nNode.js | **${process.version}**\nRam | **${
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100
        } MB** `,
        true
      )
      .field(
        "Command usage",
        `All time | **${(
          await ctx.worker.db.commandDB.getCommands()
        ).length.toLocaleString()}**\nDaily | **${(
          await ctx.worker.db.commandDB.getTimeBoundCommands(
            1000 * 60 * 60 * 24
          )
        ).length.toLocaleString()}**\nWeekly | **${(
          await ctx.worker.db.commandDB.getTimeBoundCommands(
            1000 * 60 * 60 * 24 * 7
          )
        ).length.toLocaleString()}**`,
        true
      )
      .field(
        "Shards",
        `Cluster | **${Number(ctx.worker.comms.id) + 1} / ${
          stats.length
        }**\nShard | **${currentShard + 1} / ${stats.reduce(
          (a, cluster) => a + Object.keys(cluster.shards).length,
          0
        )}**`,
        true
      )
      .field("Ping", `Database | **${databasePing}ms**\nShard | **${Array.from(ctx.worker.shards)[currentShard][1].ping}ms**`, true)
      .field(
        "Useful Resources",
        `[Command List](${ctx.worker.config.dashboard.site}/commands)\n[Dashboard](${ctx.worker.config.dashboard.site})`
      )
      .send();
  },
};
