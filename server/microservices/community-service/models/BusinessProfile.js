import mongoose from 'mongoose';

// BusinessProfile schema with owner reference
const BusinessProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  contactInfo: {
    phone: String,
    email: String,
    address: String,
  },
  ownerUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Exporting the BusinessProfile model
export default mongoose.model('BusinessProfile', BusinessProfileSchema);
