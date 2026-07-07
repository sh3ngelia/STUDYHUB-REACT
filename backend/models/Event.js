import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date:  { type: String, required: true },
    text:  { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);