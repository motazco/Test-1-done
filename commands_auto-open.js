import { SlashCommandBuilder } from '@discordjs/builders';
import { AutoOpenModel } from '../models/AutoOpen.js';

export const data = new SlashCommandBuilder()
  .setName('auto-open')
  .setDescription('إعداد الفتح والإغلاق التلقائي للغرف')
  .addChannelOption(option => 
    option.setName('category')
      .setDescription('الفئة التي سيتم فتحها/إغلاقها تلقائيًا')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('open_time')
      .setDescription('وقت فتح الغرف (HH:MM)')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('close_time')
      .setDescription('وقت إغلاق الغرف (HH:MM)')
      .setRequired(true))
  .addRoleOption(option =>
    option.setName('member_role')
      .setDescription('الرتبة التي سيتم منحها الوصول عند فتح الغرف')
      .setRequired(true))
  .addChannelOption(option =>
    option.setName('done_room')
      .setDescription('الغرفة التي سيتم إرسال الإشعارات إليها عند فتح/إغلاق الغرف')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('image')
      .setDescription('رابط الصورة التي سيتم تضمينها في الإشعارات')
      .setRequired(false));

export async function execute(interaction) {
  const category = interaction.options.getChannel('category');
  const openTime = interaction.options.getString('open_time');
  const closeTime = interaction.options.getString('close_time');
  const memberRole = interaction.options.getRole('member_role');
  const doneRoom = interaction.options.getChannel('done_room');
  const imageUrl = interaction.options.getString('image');

  // التحقق من صحة تنسيق الوقت
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(openTime) || !timeRegex.test(closeTime)) {
    return interaction.reply({ content: 'تنسيق الوقت غير صالح. يرجى استخدام HH:MM.', ephemeral: true });
  }

  try {
    await AutoOpenModel.findOneAndUpdate(
      { guildId: interaction.guild.id, categoryId: category.id },
      {
        guildId: interaction.guild.id,
        categoryId: category.id,
        openTime,
        closeTime,
        memberRoleId: memberRole.id,
        doneRoomId: doneRoom.id,
        image: imageUrl
      },
      { upsert: true, new: true }
    );

    await interaction.reply({ content: 'تم حفظ إعدادات الفتح التلقائي.', ephemeral: true });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'حدث خطأ أثناء حفظ الإعدادات.', ephemeral: true });
  }
}

