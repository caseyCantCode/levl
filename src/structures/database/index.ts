import config from "../../config.json";
import mongoose from "mongoose";
import { CommandDB } from "./CommandDB";
import { LevelWorker } from "../../worker";
export class Database {
  commandDB = new CommandDB();

  constructor(worker: LevelWorker) {
    mongoose
      .connect(config.mongo.url ?? "", {
        // @ts-expect-error
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => console.log("Database started "))
      .catch(console.log);
  }
}

export { CommandDB };
