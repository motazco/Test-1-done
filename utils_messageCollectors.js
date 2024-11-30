import { FeedbackModel } from '../models/Feedback.js';
import { SuggestionModel } from '../models/Suggestion.js';
import { AutoTaxModel } from '../models/AutoTax.js';
import logger from './logger.js';

export const setupMessageCollectors = async (client) => {
  const feedbackChannels = await FeedbackModel.find({});
  const suggestionChannels = await SuggestionModel.find({});
  const autoTaxChannels = await AutoTaxModel.find({});

  for (const feedbackChannel of feedbackChannels) {
    const channel = client.channels.cache.get(feedbackChannel.channelId);
    if (channel) {
      setupFeedbackCollector(channel);
    }
  }

  for (const suggestionChannel of suggestionChannels) {
    const channel = client.channels.cache.get(suggestionChannel.channelId);
    if (channel) {
      setupSuggestionCollector(channel);
    }
  }

  for (const autoTaxChannel of autoTaxChannels) {
    const channel = client.channels.cache.get(autoTaxChannel.channelId);
    if (channel) {
      setupAutoTaxCollector(channel);
    }
  }
};

function setupFeedbackCollector(channel) {
  const collector = channel.createMessageCollector({ filter: m => !m.author.bot });
  collector.on('collect', async (message) => {
    const embed = {
      color: 0x0099ff,
      title: 'شكراً على ملاحظاتك!',
      description: 'نقدر مساهمتك وسنراجعها بعناية.',
      timestamp: new Date(),
      footer: {
        text: message.guild.name,
        icon_url: message.guild.iconURL(),
      },
    };

    await message.reply({ embeds: [embed] });
    logger.info(`Received feedback in channel ${channel.id} from user ${message.author.id}`);
  });
}

function setupSuggestionCollector(channel) {
  const collector = channel.createMessageCollector({ filter: m => !m.author.bot });
  collector.on('collect', async (message) => {
    await message.react('✅');
    await message.react('❌');
    logger.info(`Added reactions to suggestion in channel ${channel.id} from user ${message.author.id}`);
  });
}

function setupAutoTaxCollector(channel) {
  const collector = channel.createMessageCollector({ filter: m => !m.author.bot });
  collector.on('collect', async (message) => {
    const content = message.content.toLowerCase();
    if (!/^[\d.]+[km]?$/.test(content)) {
      await message.delete();
      return;
    }

    let number = parseFloat(content.replace(/[km]/g, ''));
    if (content.endsWith('k')) number *= 1000;
    if (content.endsWith('m')) number *= 1000000;

    const tax = number * 0.05;
    await message.reply(`الضريبة (5%): ${tax.toFixed(2)}`);
    logger.info(`Calculated tax for message in channel ${channel.id} from user ${message.author.id}`);
  });
}

