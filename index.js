import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { registerCommands } from './utils/commandHandler.js';
import { handleInteractions } from './utils/interactionHandler.js';
import { initializeScheduler } from './utils/scheduler.js';
import { errorHandler } from './utils/errorHandler.js';
import { setupMessageCollectors } from './utils/messageCollectors.js';
import logger from './utils/logger.js';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch((err) => logger.error('MongoDB connection error:', err));

client.once('ready', async () => {
  logger.info(`Logged in as ${client.user.tag}`);
  await registerCommands(client);
  initializeScheduler(client);
  setupMessageCollectors(client);
});

client.on('interactionCreate', async (interaction) => {
  try {
    await handleInteractions(interaction);
  } catch (error) {
    errorHandler(error, interaction);
  }
});

client.on('error', (error) => {
  logger.error('Client error:', error);
});

client.login(process.env.DISCORD_TOKEN);

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

