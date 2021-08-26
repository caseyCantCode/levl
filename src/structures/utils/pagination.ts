import { APIMessage } from "discord-api-types";
import { LevelContext } from "../context";

export default async function pagination(
  ctx: LevelContext,
  paginationCache: {},
  embeds: { [key: string]: {} }[]
): Promise<{}> {
  let m: APIMessage = await ctx.reply({
    embeds: [embeds[0].obj],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 1,
            emoji: {
              name: "cutie_backward",
              id: "848237448269135924",
            },
            custom_id: "back",
          },
          {
            type: 2,
            style: 4,
            emoji: {
              name: "cutie_trash",
              id: "848216792845516861",
            },
            custom_id: "delete",
          },
          {
            type: 2,
            style: 1,
            emoji: {
              name: "cutie_forward",
              id: "848237230363246612",
            },
            custom_id: "forward",
          },
        ],
      },
    ],
  });
  paginationCache[m.id] = {
    embeds,
    page: 0,
    author: ctx.author.id,
  };
  return paginationCache
}
