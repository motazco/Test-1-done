import { SlashCommandBuilder } from '@discordjs/builders';
import { AutoTaxModel } from '../models/AutoTax.js';

export const data = new SlashCommandBuilder()
  .setName('auto-tax')
  .setDescription('إعداد حساب الضريبة التلقائي في قناة')
  .addChannelOption(option => 
    option.setName('channel')
      .setDescription('القناة التي سيتم إعداد حساب الضريبة التلقائي فيها')
      .setRequired(true));

export async function execute(interaction) {
  const channel = interaction.options.getChannel('channel');

  try {
    await AutoTaxModel.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { guildId: interaction.guild.id, channelId: channel.id },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: `تم إعداد حساب الضريبة التلقائي في ${channel}.`, ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'حدث خطأ أثناء إعداد قناة حساب الضريبة التلقائي.', ephemeral: true });
  }
}

