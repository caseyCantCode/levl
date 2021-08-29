export default interface subcommandInterface {
  description: string;
  command: string;
  aliases: string[];
  ownerOnly?: boolean;
}
