import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
});

export const FeedbackModel = mongoose.model('Feedback', feedbackSchema);

