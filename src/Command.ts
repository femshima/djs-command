import {
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  CommandInteraction,
  Guild,
} from 'discord.js';
import CommandManager from './CommandManager';

export default interface Command {
  definition: ApplicationCommandData;
  permission?: (
    guild: Guild
  ) =>
    | ApplicationCommandPermissionData[]
    | Promise<ApplicationCommandPermissionData[]>;
  handler: (
    interaction: CommandInteraction<'cached'>,
    commandManager: CommandManager
  ) => void | Promise<void>;
}
