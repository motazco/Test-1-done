import fs from 'fs';
import logger from './logger.js';

const commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`../commands/${file}`);
  commands.set(command.data.name, command);
}

export const handleInteractions = async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName}:`, error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
};

