import mongoose from 'mongoose';

const HelpRequestSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  location: { type: String },
  isResolved: { type: Boolean, default: false },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },

  // ✅ Optional: tags to help AI match volunteers better
  tags: [{ type: String }] // e.g., ['pets', 'transport', 'urgent']
});

export default mongoose.model('HelpRequest', HelpRequestSchema);
