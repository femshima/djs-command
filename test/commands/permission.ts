import {
  ApplicationCommandData,
  ApplicationCommandPermissionData,
  CommandInteraction,
  Guild,
} from 'discord.js';
import { CommandManager } from '../../src';

export const definition: ApplicationCommandData = {
  name: 'permission',
  description: 'Changes permission',
  defaultPermission: false,
  options: [
    {
      name: 'role',
      type: 'ROLE',
      description: 'The role who can use this command',
      required: true,
    },
  ],
};
export async function permission(guild: Guild) {
  const data: ApplicationCommandPermissionData[] = [
    {
      type: 'ROLE',
      id: guild.roles.everyone.id,
      permission: true,
    },
  ];
  return data;
}
export async function handler(
  interaction: CommandInteraction<'cached'>,
  commandManager: CommandManager
) {
  await commandManager.setPermission(interaction.guildId, 'permission', [
    {
      type: 'ROLE',
      id: interaction.options.getRole('role', true).id,
      permission: true,
    },
  ]);
  await interaction.reply('Set permission!');
}
