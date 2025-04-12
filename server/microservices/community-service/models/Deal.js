import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true },
  title: { type: String, required: true },
  description: String,
  validUntil: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Deal', DealSchema);