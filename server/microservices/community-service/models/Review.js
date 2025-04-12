import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  sentiment: String, //AI-generated field (positive/negative/neutral)
  response: String,  // Business owner's reply
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', ReviewSchema);