import { SlashCommandBuilder } from '@discordjs/builders';
import { SuggestionModel } from '../models/Suggestion.js';

export const data = new SlashCommandBuilder()
  .setName('sug')
  .setDescription('إعداد قناة للاقتراحات')
  .addChannelOption(option => 
    option.setName('channel')
      .setDescription('القناة التي سيتم إعدادها للاقتراحات')
      .setRequired(true));

export async function execute(interaction) {
  const channel = interaction.options.getChannel('channel');

  try {
    await SuggestionModel.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { guildId: interaction.guild.id, channelId: channel.id },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `تم إعداد جمع الاقتراحات في ${channel}.`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'حدث خطأ أثناء إعداد قناة الاقتراحات.', ephemeral: true });
  }
}

