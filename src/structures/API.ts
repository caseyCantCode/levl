import config from "../config.json";

import { Thread } from "discord-rose";

import { LoadRoutes as loadRoutes } from "@jpbberry/load-routes";

import express from "express";

import { APIWorker } from "./APIWorker";
interface APIOptions {
  routesPath: string;
}

export class API {
  config = config;

  app = express();

  comms = new Thread();
  bot = new APIWorker(this);
  constructor({ routesPath }: APIOptions) {
    this.bot.start();

    this.app.set("trust-proxy", true);

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    loadRoutes(this.app, routesPath, this);

    this.app.listen(this.config.api.port, () => {
      this.comms.log("Starting on port", this.config.api.port);
    });
  }
}
