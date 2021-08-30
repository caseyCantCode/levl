import { Snowflake } from "discord-api-types";
function idToBinary(num: Snowflake) {
  let bin = "";
  let high = parseInt(num.slice(0, -10)) || 0;
  let low = parseInt(num.slice(-10));
  while (low > 0 || high > 0) {
    bin = String(low & 1) + bin;
    low = Math.floor(low / 2);
    if (high > 0) {
      low += 5000000000 * (high % 2);
      high = Math.floor(high / 2);
    }
  }
  return bin;
}
export function formatList(list: []): string {
  if (!list || !Array.isArray(list)) throw new Error("Invalid array");
  return list.join(", ").replace(/, ((?:.(?!, ))+)$/, " and $1");
}
export function getCreatedAt(id: Snowflake) {
  let startingEpoch = 1420070400000;

  const dateTimestamp = //@ts-expect-error
    parseInt(idToBinary(id).toString(2).padStart(64, "0").substring(0, 42), 2) +
    startingEpoch;
  const date = new Date(dateTimestamp);
  return { date: date.toISOString(), timestamp: dateTimestamp };
}

export async function getMemberRoles(ctx, query: string): Promise<{}[]> {
  let currentMember = await ctx
      .server(ctx.worker, ctx.message.guild_id, ctx.message.author.id)
      .getMember(query),
    roles = [];
  for (let role of currentMember.roles) {
    roles.push(
      await ctx
        .server(ctx.worker, ctx.message.guild_id, ctx.message.author.id)
        .getRole(role)
    );
  }
  return roles;
}
