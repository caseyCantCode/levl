import config from '../config.json'

import { SingleWorker } from 'discord-rose'

import { API } from './API'

export class APIWorker extends SingleWorker {
  constructor(api: API) {
    super({
      token: config.bot.token,
      cache: {
        channels: true,
        guilds: true,
        members: true,
        messages: true,
        roles: true,
        self: true,
        users: true,
        voiceStates: true
      },
      intents: 32767,
      log: (msg: string) => { api.comms.log(msg) }
    })
  }
}