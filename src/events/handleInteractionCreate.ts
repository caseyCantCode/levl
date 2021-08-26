import { APIMessage } from "discord-api-types";
import { LevelWorker } from "../worker";

export default async (data, worker: LevelWorker): Promise<any> => {
  let paginationObject = worker.pagination[data.message.id];
  if (paginationObject) {
    let editMessage = async () => {
        worker.api.request(
          "POST",
          `/interactions/${data.id}/${data.token}/callback`,
          {
            body: {
              type: 7,
              data: {
                embeds: [paginationObject.embeds[paginationObject.page].obj],
                ...data.message.components,
              },
            },
          }
        );
      },
      getPaginationObject = (page: number): {} => {
        return {
          ...paginationObject,
          page: page,
        };
      };
    switch (data.data.custom_id) {
      case "back":
        worker.pagination[data.message.id] = getPaginationObject(
          !paginationObject.page
            ? paginationObject.embeds.length - 1
            : paginationObject.page - 1
        );
        paginationObject = worker.pagination[data.message.id];
        await editMessage();
        break;
      case "delete":
        delete worker.pagination[data.message.id];
        await worker.api.request(
          "DELETE",
          `/channels/${data.channel_id}/messages/${data.message.id}`
        );
        break;
      case "forward":
        worker.pagination[data.message.id] = getPaginationObject(
          paginationObject.page === paginationObject.embeds.length - 1
            ? 0
            : paginationObject.page + 1
        );
        paginationObject = worker.pagination[data.message.id];
        await editMessage();
        break;
    }
  }
};
