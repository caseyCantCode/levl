import { LevelContext as NewContext } from './structures/context'

declare module 'discord-rose/dist/typings/lib' {

  interface LevelContext extends NewContext { }

  interface CommandOptions extends CommandOptions {
    description: string
    command: string,
    aliases: string[],
    ownerOnly?: boolean
  }
}