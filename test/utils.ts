import readenv from '@cm-ayf/readenv';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const env = readenv({
  BOT_TOKEN: {},
});
