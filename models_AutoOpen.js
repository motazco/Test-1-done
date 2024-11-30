import mongoose from 'mongoose';

const autoOpenSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  categoryId: { type: String, required: true },
  openTime: { type: Date, required: true },
  closeTime: { type: Date, required: true },
  memberRoleId: { type: String, required: true },
  doneRoomId: { type: String, required: true },
  image: { type: String },
});

export const AutoOpenModel = mongoose.model('AutoOpen', autoOpenSchema);

