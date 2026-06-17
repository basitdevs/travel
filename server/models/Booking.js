import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    travelDate: { type: Date, required: true },
    travelers: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    invoiceNumber: { type: String, unique: true, sparse: true },
    specialRequests: { type: String, default: '' },
  },
  { timestamps: true }
);

bookingSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
