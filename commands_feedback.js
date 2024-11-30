import { SlashCommandBuilder } from '@discordjs/builders';
import { FeedbackModel } from '../models/Feedback.js';

export const data = new SlashCommandBuilder()
  .setName('feedback')
  .setDescription('إعداد قناة للملاحظات')
  .addChannelOption(option => 
    option.setName('channel')
      .setDescription('القناة التي سيتم إعدادها للملاحظات')
      .setRequired(true));

export async function execute(interaction) {
  const channel = interaction.options.getChannel('channel');

  try {
    await FeedbackModel.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { guildId: interaction.guild.id, channelId: channel.id },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `تم إعداد جمع الملاحظات في ${channel}.`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'حدث خطأ أثناء إعداد قناة الملاحظات.', ephemeral: true });
  }
}

