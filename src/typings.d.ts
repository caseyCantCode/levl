import { LevelContext as NewContext } from './structures/context'
import subcommandInterface from "./interfaces/subcommandInterface"
declare module 'discord-rose/dist/typings/lib' {

  interface LevelContext extends NewContext { }

  interface CommandOptions extends CommandOptions {
    description: string
    command: string,
    aliases: string[],
    ownerOnly?: boolean,
    subcommands?: subcommandInterface[]
  }
}