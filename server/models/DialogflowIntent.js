import mongoose from 'mongoose';

const dialogflowIntentSchema = new mongoose.Schema({
  intentName: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String
  },
  handlerFunction: {
    type: String,
    required: true
  }
}, { timestamps: true });

const DialogflowIntent = mongoose.model('DialogflowIntent', dialogflowIntentSchema);

export default DialogflowIntent;