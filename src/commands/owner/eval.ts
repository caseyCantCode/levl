import pagination from "../../structures/utils/pagination";
import { transpile } from "typescript";
import { inspect } from "util";
import { Type } from "@sapphire/type";
import { performance } from "perf_hooks";
let last: string;
export default {
  command: "eval",
  aliases: ["e", "evak"],
  description: "Eval's code",
  ownerOnly: true,
  exec: async (ctx): Promise<void> => {
    let code = ctx.args.join(" ").replace(/`{3}(\w+)?/g, "");
    try {
      let time = performance.now();
      if (ctx.flags.l || ctx.flags.last) code = last;
      if (!ctx.flags.l || !ctx.flags.last) last = code;
      code = transpile(code);
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
      let evalEmbeds = require("string-toolkit")
        .toChunks(evaled, 2000)
        .map((_code: string) =>
          ctx.embed
            .color(ctx.color)
            .description(`\`\`\`js\n${_code}\`\`\``)
            .field("Type of", `\`\`\`js\n${type}\`\`\``)
            .field("Time", `\`\`\`css\n${performance.now() - time}ms\`\`\``)
        );
      if (ctx.flags.s || ctx.flags.silent) return;
      await pagination(ctx, ctx.worker.pagination, evalEmbeds);
    } catch (err) {
      if (ctx.flags.s || ctx.flags.silent) return;
      return await ctx.embed
        .color(ctx.color)
        .description(
          `\`\`\`js\n ${err.message.replace(
            /(require(\s+)stack(:)([\s\S]*))?/gim,
            ""
          )}\`\`\``
        )
        .title("Error")
        .send();
    }
  },
};
