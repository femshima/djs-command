import { Client, Intents } from 'discord.js';
import { env } from './utils';
import * as handler from './handlers';

const clientOptions = {
  intents: [Intents.FLAGS.GUILDS],
};

const client = new Client(clientOptions);

client.on('ready', handler.ready);

client.login(env.BOT_TOKEN);
