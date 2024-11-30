import mongoose from 'mongoose';

const autoTaxSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
});

export const AutoTaxModel = mongoose.model('AutoTax', autoTaxSchema);

