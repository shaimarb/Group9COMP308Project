import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);
export default EmergencyAlert;