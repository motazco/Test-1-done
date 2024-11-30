import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
});

export const SuggestionModel = mongoose.model('Suggestion', suggestionSchema);

