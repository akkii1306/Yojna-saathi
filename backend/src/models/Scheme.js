// backend/src/models/Scheme.js
import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String }, // e.g., 'farmer', 'student', 'women'
    state: { type: String, default: 'All' }, // 'All' or specific state
    description: { type: String },
    eligibility: { type: String },
    documents: [{ type: String }],
    benefits: { type: String },
    applyLink: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Scheme = mongoose.model('Scheme', schemeSchema);

export default Scheme;
