import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    country: { type: String, required: true },
    city: { type: String, required: true },
    images: [{ type: String }],
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['adventure', 'beach', 'cultural', 'luxury', 'wildlife', 'city'],
      default: 'adventure',
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    availableDates: [{ type: Date }],
    includedServices: [{ type: String }],
    excludedServices: [{ type: String }],
    hotelInfo: { type: String, default: '' },
    maxTravelers: { type: Number, default: 20 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
