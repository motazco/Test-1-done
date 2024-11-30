import cron from 'node-cron';
import { AutoOpenModel } from '../models/AutoOpen.js';
import logger from './logger.js';

export const initializeScheduler = (client) => {
  cron.schedule('* * * * *', async () => {
    const currentTime = new Date();
    const autoOpenTasks = await AutoOpenModel.find({});

    for (const task of autoOpenTasks) {
      const guild = client.guilds.cache.get(task.guildId);
      if (!guild) continue;

      const openTime = new Date(task.openTime);
      const closeTime = new Date(task.closeTime);

      if (currentTime.getHours() === openTime.getHours() && currentTime.getMinutes() === openTime.getMinutes()) {
        await openRooms(guild, task);
      } else if (currentTime.getHours() === closeTime.getHours() && currentTime.getMinutes() === closeTime.getMinutes()) {
        await closeRooms(guild, task);
      }
    }
  });
};

async function openRooms(guild, task) {
  const category = guild.channels.cache.get(task.categoryId);
  const memberRole = guild.roles.cache.get(task.memberRoleId);
  const doneRoom = guild.channels.cache.get(task.doneRoomId);

  if (!category || !memberRole || !doneRoom) {
    logger.error(`Missing category, member role, or done room for guild ${guild.id}`);
    return;
  }

  for (const channel of category.children.cache.values()) {
    await channel.permissionOverwrites.edit(memberRole, { ViewChannel: true });
  }

  const embed = {
    color: 0x0099ff,
    title: 'Rooms Opened',
    description: `The rooms in ${category.name} have been opened.`,
    timestamp: new Date(),
    footer: {
      text: guild.name,
      icon_url: guild.iconURL(),
    },
  };

  if (task.image) {
    embed.image = { url: task.image };
  }

  await doneRoom.send({ embeds: [embed] });
  logger.info(`Opened rooms in category ${category.name} for guild ${guild.id}`);
}

async function closeRooms(guild, task) {
  // Similar implementation to openRooms, but setting ViewChannel to false
  // ...
}

