import pagination from "../../structures/utils/pagination";
export default {
  command: "eval",
  aliases: ["e", "evak"],
  description: "Eval's code",
  ownerOnly: true,
  exec: async (ctx): Promise<void> => {
    const code = ctx.args.join(" "),
      { inspect } = require("util"),
      { Type } = require("@sapphire/type"),
      { performance } = require("perf_hooks");
    try {
      let time = performance.now();
      let evaled = eval(code);
      if (evaled && evaled instanceof Promise) evaled = await evaled;
      let type = new Type(evaled).toString();

      if (typeof evaled !== "string")
        evaled = inspect(evaled, {
          depth: +(ctx.flags.d || ctx.flags.depth || 0),
        });

      evaled = evaled
        .replace(/`/g, `\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `@${String.fromCharCode(8203)}`);
      let stringTools = new (require("string-toolkit"))();
      let evalEmbeds = stringTools.toChunks(evaled, 2000).map((thing) =>
        ctx.embed
          .color(ctx.color)
          .description(`\`\`\`js\n${thing}\`\`\``)
          .field("Type of", `\`\`\`js\n${type}\`\`\``)
          .field("Time", `\`\`\`css\n${performance.now() - time}ms\`\`\``)
      );
      await pagination(ctx, ctx.worker.pagination, evalEmbeds);
    } catch (err) {
      return await ctx
        .embed()
        .color(ctx.color)
        .description(
          `\`\`\`js\n ${err.message.replace(
            /(require(\s+)stack(:)([\s\S]*))?/gim,
            ""
          )}\`\`\``
        )
        .title("Error");
    }
  },
};
