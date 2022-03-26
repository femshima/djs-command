import { Client } from 'discord.js';
import { CommandManager } from '../../src';
import * as hello from './hello';
import * as permission from './permission';

const commands = [hello, permission];

export async function setCommands(client: Client<true>) {
  const commandManager = new CommandManager(client, false, commands);
  await commandManager.fetchGuilds();
  await commandManager.register();
}
