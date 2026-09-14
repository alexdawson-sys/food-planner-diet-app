const mongoose = require('mongoose')

const progressEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    weight: { type: Number, required: true },
    notes: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('ProgressEntry', progressEntrySchema)
