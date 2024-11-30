import logger from './logger.js';

export const errorHandler = (error, interaction) => {
  logger.error('An error occurred:', error);

  if (interaction && interaction.replied) {
    interaction.followUp({ content: 'An error occurred while processing your request.', ephemeral: true });
  } else if (interaction && !interaction.replied) {
    interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
  }

  // Here you can add additional error handling logic, such as sending notifications to a specific channel or user
};

