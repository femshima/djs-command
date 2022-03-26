import { Client } from 'discord.js';
import { setCommands } from './commands';

export async function ready(client: Client<true>) {
  console.log(`logged in as ${client.user.tag}`);
  await setCommands(client);
  console.log('Command is ready.');
}
