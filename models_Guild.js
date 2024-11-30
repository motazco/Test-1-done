import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  // Add other guild-specific settings here
});

export const GuildModel = mongoose.model('Guild', guildSchema);

