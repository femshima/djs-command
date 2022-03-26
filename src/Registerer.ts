import { ApplicationCommand, ApplicationCommandData, Client, Collection, Guild, GuildResolvable, Snowflake } from "discord.js";


export abstract class CommandRegisterer {
  constructor(readonly client: Client, readonly commands: ApplicationCommandData[]) { }
  abstract register(): Promise<void>;
  public guildCreateHandler(guild: Guild): void | Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public guildCreateHandler() { };
  abstract getCommand(
    commandName: string,
    guildId?: Snowflake
  ): Promise<ApplicationCommand<{ guild: GuildResolvable }>>;
}

export class GuildCommandRegisterer extends CommandRegisterer {
  private commandCache?: Collection<string, ApplicationCommand>;
  constructor(client: Client, commands: ApplicationCommandData[]) {
    super(client, commands);
  }
  async register() {
    await Promise.all(
      this.client.guilds.cache.map(async (guild) => {
        await this.registerForGuild(guild);
      })
    );
  }
  async registerForGuild(guild: Guild) {
    if (guild.ownerId === guild.me?.id) return;
    const guildId = guild.id;
    const registeredCommands = await this.client.application?.commands.set(
      this.commands,
      guildId
    );
    if (!registeredCommands)
      return Promise.reject(new Error('Command Registration failed'));
    this.commandCache = new Collection(
      registeredCommands.map((command) => [
        GuildCommandRegisterer.#getCommandKey(command.name, guildId),
        command,
      ])
    );
  }
  async getCommand(commandName: string, guildId?: Snowflake) {
    if (!guildId)
      return Promise.reject(
        new Error('Cannot identify command without guildId')
      );
    return (
      this.commandCache?.get(
        GuildCommandRegisterer.#getCommandKey(commandName, guildId)
      ) ?? Promise.reject(new Error('Command not found'))
    );
  }
  public async guildCreateHandler(guild: Guild) {
    await this.registerForGuild(guild);
  }
  static #getCommandKey(commandName: string, guildId: string) {
    return guildId + '\n' + commandName;
  }
}

export class GlobalCommandRegisterer extends CommandRegisterer {
  private commandCache?: Collection<
    Snowflake,
    ApplicationCommand<{ guild: GuildResolvable }>
  >;
  constructor(client: Client<true>, commands: ApplicationCommandData[]) {
    super(client, commands);
  }
  async register() {
    const registeredCommands = await this.client.application?.commands.set(
      this.commands
    );
    if (!registeredCommands)
      return Promise.reject(new Error('Command Registration failed'));
    this.commandCache = new Collection(
      registeredCommands.map((command) => [command.name, command])
    );
  }
  async getCommand(commandName: string) {
    return (
      this.commandCache?.get(commandName) ??
      Promise.reject(new Error('Command not found'))
    );
  }
}
