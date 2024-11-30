import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('talabat')
  .setDescription('ينشئ لوحة للطلبات (العناصر، التطوير، التصميم)')
  .addChannelOption(option => 
    option.setName('panel_room')
      .setDescription('الغرفة التي سيتم إرسال اللوحة إليها')
      .setRequired(true))
  .addChannelOption(option => 
    option.setName('item_room')
      .setDescription('الغرفة التي سيتم إرسال طلبات العناصر إليها')
      .setRequired(true))
  .addChannelOption(option => 
    option.setName('dev_room')
      .setDescription('الغرفة التي سيتم إرسال طلبات التطوير إليها')
      .setRequired(true))
  .addChannelOption(option => 
    option.setName('design_room')
      .setDescription('الغرفة التي سيتم إرسال طلبات التصميم إليها')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('image')
      .setDescription('رابط الصورة التي سيتم تضمينها في اللوحة')
      .setRequired(false));

export async function execute(interaction) {
  const panelRoom = interaction.options.getChannel('panel_room');
  const itemRoom = interaction.options.getChannel('item_room');
  const devRoom = interaction.options.getChannel('dev_room');
  const designRoom = interaction.options.getChannel('design_room');
  const imageUrl = interaction.options.getString('image');

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('لوحة الطلبات')
    .setDescription('انقر على زر لتقديم طلب')
    .setTimestamp();

  if (imageUrl) {
    embed.setImage(imageUrl);
  }

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('item')
        .setLabel('العناصر')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('dev')
        .setLabel('التطوير')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('design')
        .setLabel('التصميم')
        .setStyle(ButtonStyle.Primary)
    );

  const message = await panelRoom.send({ embeds: [embed], components: [row] });

  const filter = i => ['item', 'dev', 'design'].includes(i.customId) && i.user.id === interaction.user.id;
  const collector = message.createMessageComponentCollector({ filter });

  collector.on('collect', async i => {
    await i.showModal({
      title: `طلب ${i.customId === 'item' ? 'عنصر' : i.customId === 'dev' ? 'تطوير' : 'تصميم'}`,
      custom_id: `${i.customId}_modal`,
      components: [{
        type: 1,
        components: [{
          type: 4,
          custom_id: 'request',
          label: 'طلبك',
          style: 2,
          min_length: 1,
          max_length: 1000,
          placeholder: 'أدخل طلبك هنا',
          required: true
        }]
      }]
    });

    try {
      const submitted = await i.awaitModalSubmit({ time: 60000, filter: i => i.user.id === interaction.user.id });
      const request = submitted.fields.getTextInputValue('request');

      const requestEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`طلب ${i.customId === 'item' ? 'عنصر' : i.customId === 'dev' ? 'تطوير' : 'تصميم'}`)
        .addFields(
          { name: 'المستخدم', value: interaction.user.toString() },
          { name: 'الطلب', value: request }
        )
        .setTimestamp()
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

      let targetRoom;
      switch (i.customId) {
        case 'item':
          targetRoom = itemRoom;
          break;
        case 'dev':
          targetRoom = devRoom;
          break;
        case 'design':
          targetRoom = designRoom;
          break;
      }

      await targetRoom.send({ embeds: [requestEmbed] });
      await submitted.reply({ content: `تم إرسال طلب ${i.customId === 'item' ? 'العنصر' : i.customId === 'dev' ? 'التطوير' : 'التصميم'} الخاص بك.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await i.followUp({ content: 'حدث خطأ أثناء معالجة طلبك.', ephemeral: true });
    }
  });

  await interaction.reply({ content: 'تم إعداد لوحة الطلبات.', ephemeral: true });
}

