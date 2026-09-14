import mongoose from 'mongoose';

const weightSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    value: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export const Weight = mongoose.model('Weight', weightSchema);
