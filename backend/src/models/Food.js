import mongoose from 'mongoose';

const nutrientSchema = new mongoose.Schema(
  {
    name: String,
    amount: Number,
    unit: String,
  },
  { _id: false },
);

const foodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true, index: true },
    barcode: { type: String, trim: true, sparse: true },
    category: { type: String, default: 'General' },
    servingSize: { type: Number, default: 1 },
    servingUnit: { type: String, default: 'serving' },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    vitamins: [nutrientSchema],
    favorite: { type: Boolean, default: false },
    source: { type: String, enum: ['usda', 'custom'], default: 'custom' },
  },
  { timestamps: true },
);

export const Food = mongoose.model('Food', foodSchema);
