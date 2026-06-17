import Tour from '../models/Tour.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200';

const searchRegex = (value) => ({ $regex: value, $options: 'i' });

const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value === true || value === 'true';
};

const toArray = (value, fallback = []) => {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
  } catch {
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
  }
};

const buildQuery = ({
  search,
  country,
  city,
  category,
  minPrice,
  maxPrice,
  minDuration,
  maxDuration,
  featured,
  all,
}) => {
  const query = all === 'true' ? {} : { isActive: true };

  if (search) {
    query.$or = [
      { title: searchRegex(search) },
      { description: searchRegex(search) },
      { city: searchRegex(search) },
      { country: searchRegex(search) },
    ];
  }
  if (country) query.country = searchRegex(country);
  if (city) query.city = searchRegex(city);
  if (category) query.category = category;
  if (featured === 'true') query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (minDuration || maxDuration) {
    query.duration = {};
    if (minDuration) query.duration.$gte = Number(minDuration);
    if (maxDuration) query.duration.$lte = Number(maxDuration);
  }

  return query;
};

const normalizeTourData = (body) => {
  const data = { ...body };

  if (data.images !== undefined) data.images = toArray(data.images);
  if (data.includedServices !== undefined) data.includedServices = toArray(data.includedServices);
  if (data.excludedServices !== undefined) data.excludedServices = toArray(data.excludedServices);
  if (data.availableDates !== undefined) {
    data.availableDates = toArray(data.availableDates).map((date) => new Date(date));
  }
  if (data.price !== undefined) data.price = Number(data.price);
  if (data.duration !== undefined) data.duration = Number(data.duration);
  if (data.maxTravelers !== undefined) data.maxTravelers = Number(data.maxTravelers) || 20;
  if (data.isFeatured !== undefined) data.isFeatured = toBoolean(data.isFeatured);
  if (data.isActive !== undefined) data.isActive = data.isActive !== false && data.isActive !== 'false';

  return data;
};

const hasTourRequiredFields = ({ title, description, country, city, duration, price }) => (
  title && description && country && city && duration && price
);

export const getTours = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const query = buildQuery(req.query);
  const skip = (page - 1) * limit;

  const [tours, total] = await Promise.all([
    Tour.find(query).populate('destination').sort(req.query.sort || '-createdAt').skip(skip).limit(limit),
    Tour.countDocuments(query),
  ]);

  res.json({
    tours,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getTourById = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id).populate('destination');
  if (!tour) return res.status(404).json({ message: 'Tour not found' });
  res.json(tour);
});

export const createTour = asyncHandler(async (req, res) => {
  if (!hasTourRequiredFields(req.body)) {
    return res.status(400).json({ message: 'Title, description, country, city, duration, and price are required' });
  }

  const data = normalizeTourData(req.body);
  if (!data.images?.length) data.images = [DEFAULT_IMAGE];
  if (data.maxTravelers === undefined) data.maxTravelers = 20;
  if (data.isFeatured === undefined) data.isFeatured = false;
  if (data.isActive === undefined) data.isActive = true;

  if (Number.isNaN(data.price) || Number.isNaN(data.duration)) {
    return res.status(400).json({ message: 'Price and duration must be valid numbers' });
  }

  const tour = await Tour.create(data);
  res.status(201).json(tour);
});

export const updateTour = asyncHandler(async (req, res) => {
  let tour = await Tour.findById(req.params.id);
  if (!tour) return res.status(404).json({ message: 'Tour not found' });

  const data = normalizeTourData(req.body);
  if (Number.isNaN(data.price) || Number.isNaN(data.duration)) {
    return res.status(400).json({ message: 'Price and duration must be valid numbers' });
  }

  tour = await Tour.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  res.json(tour);
});

export const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) return res.status(404).json({ message: 'Tour not found' });
  await tour.deleteOne();
  res.json({ message: 'Tour deleted' });
});

export const getFeaturedTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find({ isFeatured: true, isActive: true }).limit(6).populate('destination');
  res.json(tours);
});

export const getTourStats = asyncHandler(async (req, res) => {
  const total = await Tour.countDocuments();
  const active = await Tour.countDocuments({ isActive: true });
  res.json({ total, active });
});
