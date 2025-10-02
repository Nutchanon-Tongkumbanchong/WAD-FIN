// Customer model (Mongoose)
import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => v instanceof Date && v < new Date(),
        message: 'dateOfBirth must be in the past',
      },
    },
    memberNumber: { type: Number, required: true, unique: true, min: 1 },
    interests: { type: String, default: '', trim: true },
  },
  { collection: 'customers', timestamps: true }
);

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);