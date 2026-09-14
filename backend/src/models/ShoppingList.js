import mongoose from 'mongoose';

const shoppingItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'General' },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'serving' },
    estimatedCost: { type: Number, default: 0 },
    checked: { type: Boolean, default: false },
  },
  { _id: false },
);

const shoppingListSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weekStart: { type: String, required: true, index: true },
    items: [shoppingItemSchema],
  },
  { timestamps: true },
);

shoppingListSchema.index({ user: 1, weekStart: 1 }, { unique: true });

export const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);
