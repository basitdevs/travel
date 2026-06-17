import Review from '../models/Review.js';
import Tour from '../models/Tour.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const toRating = (value) => Number(value);

const isValidRating = (rating) => !Number.isNaN(rating) && rating >= 1 && rating <= 5;

const updateTourRating = async (tourId) => {
  const reviews = await Review.find({ tour: tourId });
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = total / (reviews.length || 1);

  await Tour.findByIdAndUpdate(tourId, {
    rating: Math.round(average * 10) / 10,
    reviewCount: reviews.length,
  });
};

export const createReview = asyncHandler(async (req, res) => {
  const { tourId, rating, comment } = req.body;

  if (!tourId || !rating || !comment) {
    return res.status(400).json({ message: 'Tour, rating, and comment are required' });
  }

  const ratingValue = toRating(rating);
  if (!isValidRating(ratingValue)) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const tour = await Tour.findById(tourId);
  if (!tour) return res.status(404).json({ message: 'Tour not found' });

  const existing = await Review.findOne({ user: req.user._id, tour: tourId });
  if (existing) {
    return res.status(400).json({ message: 'You have already reviewed this tour' });
  }

  const review = await Review.create({
    user: req.user._id,
    tour: tourId,
    rating: ratingValue,
    comment,
  });

  await updateTourRating(tourId);
  const populated = await Review.findById(review._id).populate('user', 'name avatar');
  res.status(201).json(populated);
});

export const getTourReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ tour: req.params.tourId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'name email')
    .populate('tour', 'title')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });

  const tourId = review.tour;
  await review.deleteOne();
  await updateTourRating(tourId);
  res.json({ message: 'Review deleted' });
});
