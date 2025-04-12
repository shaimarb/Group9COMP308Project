import mongoose from 'mongoose';

// BusinessProfile schema with owner reference
const BusinessProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  address: String, // directly include address instead of contactInfo
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  deals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }],  // Reference to the 'Deal' model
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Exporting the BusinessProfile model
export default mongoose.model('BusinessProfile', BusinessProfileSchema);
