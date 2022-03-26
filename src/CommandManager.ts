import {
  ApplicationCommandPermissionData,
  Client,
  Collection,
  CommandInteraction,
  Guild,
  Interaction,
  Snowflake,
} from 'discord.js';
import Command from './Command';
import {
  CommandRegisterer,
  GlobalCommandRegisterer,
  GuildCommandRegisterer,
} from './Registerer';

export default class CommandManager {
  private commandCollection: Collection<string, Command> = new Collection();
  private registerer: CommandRegisterer;
  constructor(
    public readonly client: Client,
    public readonly isGlobal: boolean,
    commands: Command[]
  ) {
    this.commands = commands;
    if (isGlobal) {
      this.registerer = new GlobalCommandRegisterer(
        client,
        this.commandDefinitions
      );
    } else {
      this.registerer = new GuildCommandRegisterer(
        client,
        this.commandDefinitions
      );
    }
    this.client.on('guildCreate', (guild: Guild) => {
      this.guildCreateHandler(guild);
    });
    this.client.on('interactionCreate', (interaction: Interaction) => {
      if (!interaction.inCachedGuild()) return;
      if (interaction.isCommand()) {
        this.interactionCreateHandler(interaction);
      }
    });
  }
  private set commands(commands: Command[]) {
    const coll = new Collection(
      commands.map((command) => [command.definition.name, command])
    );
    if (coll.size !== commands.length) {
      throw new Error('Duplicated command name is not allowed!');
    }
    this.commandCollection = coll;
  }
  public get commands() {
    return Array.from(this.commandCollection.values());
  }
  private get commandDefinitions() {
    return this.commands.map((command) => command.definition);
  }
  public async fetchGuilds() {
    const guilds = await this.client.guilds.fetch();
    await Promise.all(guilds.map((guild) => guild.fetch()));
  }
  public async register() {
    await this.registerer.register();
    for (const commandName in this.commandCollection.keys()) {
      await Promise.all(
        this.client.guilds.cache.map(async (guild) => {
          const permission =
            this.commandCollection.get(commandName)?.permission;
          if (!permission) return;
          const perms = await permission(guild);
          await this.setPermission(guild.id, commandName, perms);
        })
      );
    }
  }
  public async setPermission(
    guildId: Snowflake,
    commandName: string,
    permissions: ApplicationCommandPermissionData[]
  ) {
    const command = await this.registerer.getCommand(commandName, guildId);
    await command.permissions.set({
      guild: guildId,
      permissions,
    });
  }
  private async guildCreateHandler(guild: Guild) {
    await this.registerer.guildCreateHandler(guild);
  }
  private async interactionCreateHandler(
    interaction: CommandInteraction<'cached'>
  ) {
    const command = interaction.command;
    if (!command) return;
    const handler = this.commandCollection.get(command.name)?.handler;
    if (!handler) return;
    await handler(interaction);
  }
}
