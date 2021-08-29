let flags = {
    CREATE_INSTANT_INVITE: 1 << 0,
    KICK_MEMBERS: 1 << 1,
    BAN_MEMBERS: 1 << 2,
    ADMINISTRATOR: 1 << 3,
    MANAGE_CHANNELS: 1 << 4,
    MANAGE_GUILD: 1 << 5,
    ADD_REACTIONS: 1 << 6,
    VIEW_AUDIT_LOG: 1 << 7,
    PRIORITY_SPEAKER: 1 << 8,
    STREAM: 1 << 9,
    VIEW_CHANNEL: 1 << 10,
    SEND_MESSAGES: 1 << 11,
    SEND_TTS_MESSAGES: 1 << 12,
    MANAGE_MESSAGES: 1 << 13,
    EMBED_LINKS: 1 << 14,
    ATTACH_FILES: 1 << 15,
    READ_MESSAGE_HISTORY: 1 << 16,
    MENTION_EVERYONE: 1 << 17,
    USE_EXTERNAL_EMOJIS: 1 << 18,
    VIEW_GUILD_INSIGHTS: 1 << 19,
    CONNECT: 1 << 20,
    SPEAK: 1 << 21,
    MUTE_MEMBERS: 1 << 22,
    DEAFEN_MEMBERS: 1 << 23,
    MOVE_MEMBERS: 1 << 24,
    USE_VAD: 1 << 25,
    CHANGE_NICKNAME: 1 << 26,
    MANAGE_NICKNAMES: 1 << 27,
    MANAGE_ROLES: 1 << 28,
    MANAGE_WEBHOOKS: 1 << 29,
    MANAGE_EMOJIS_AND_STICKERS: 1 << 30,
    USE_APPLICATION_COMMANDS: 1 << 31,
    REQUEST_TO_SPEAK: 1 << 32,
    MANAGE_THREADS: 1 << 34,
    USE_PUBLIC_THREADS: 1 << 35,
    USE_PRIVATE_THREADS: 1 << 36,
    USE_EXTERNAL_STICKERS: 1 << 37,
  },
  formattedFlags = {
    CREATE_INSTANT_INVITE: 0,
    KICK_MEMBERS: 0,
    BAN_MEMBERS: 0,
    ADMINISTRATOR: 0,
    MANAGE_CHANNELS: 0,
    MANAGE_GUILD: 0,
    ADD_REACTIONS: 1,
    VIEW_AUDIT_LOG: 0,
    VIEW_CHANNEL: 1,
    SEND_MESSAGES: 1,
    SEND_TTS_MESSAGES: 1,
    MANAGE_MESSAGES: 1,
    EMBED_LINKS: 1,
    ATTACH_FILES: 1,
    READ_MESSAGE_HISTORY: 1,
    MENTION_EVERYONE: 1,
    USE_EXTERNAL_EMOJIS: 1,
    VIEW_GUILD_INSIGHTS: 0,
    CHANGE_NICKNAME: 0,
    MANAGE_NICKNAMES: 0,
    MANAGE_ROLES: 0,
    MANAGE_WEBHOOKS: 0,
    MANAGE_EMOJIS_AND_STICKERS: 0,
    USE_APPLICATION_COMMANDS: 1,
    MANAGE_THREADS: 0,
    USE_PUBLIC_THREADS: 1,
    USE_PRIVATE_THREADS: 1,
    USE_EXTERNAL_STICKERS: 0,
  };
export default class Permissions {
  flags = flags;
  formattedFlags = formattedFlags;
  constructor() {}
  resolve(bit: [] | string) {
    if (Array.isArray(bit))
      return bit.map((p) => this.resolve(p)).reduce((t, v) => t | v, 0);

    if (typeof bit === "string" && typeof flags[bit] !== "undefined")
      return flags[bit];
  }

  has(bit, bitfield): boolean {
    bit = this.resolve(bit);

    return (bitfield & bit) === bit;
  }
  getFlags(bitfield) {
    return Object.keys(flags).filter((flag) => this.has(flag, bitfield));
  }
}
