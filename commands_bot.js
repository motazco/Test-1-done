import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('bot')
  .setDescription('يعرض معلومات البوت ورابط الدعوة');

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('معلومات البوت')
    .setDescription('إليك بعض المعلومات عن البوت')
    .setThumbnail(interaction.client.user.displayAvatarURL())
    .addFields(
      { name: 'اسم البوت', value: interaction.client.user.username },
      { name: 'تاريخ الإنشاء', value: interaction.client.user.createdAt.toDateString() },
      { name: 'عدد السيرفرات', value: interaction.client.guilds.cache.size.toString() }
    )
    .setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setLabel('دعوة البوت')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`)
    );

  await interaction.reply({ embeds: [embed], components: [row] });
}

