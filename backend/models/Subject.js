import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    color:       { type: String, default: '#6c5ce7' },
    progress:    { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

export default mongoose.model('Subject', subjectSchema);