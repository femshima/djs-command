import { Client } from 'discord.js';
import { CommandManager } from '../src';
import * as commands from './commands';

export async function ready(client: Client<true>) {
  console.log(`logged in as ${client.user.tag}`);
  const commandManager = new CommandManager(
    client,
    false,
    Object.values(commands)
  );
  await commandManager.fetchGuilds();
  await commandManager.register();
}
