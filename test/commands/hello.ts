import { CommandInteraction } from 'discord.js';

export const definition = {
  name: 'hello',
  description: 'Say hello to world',
};
export async function handler(interaction: CommandInteraction<'cached'>) {
  await interaction.reply('Hello world!');
}
