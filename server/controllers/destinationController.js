import Destination from '../models/Destination.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const toBoolean = (value) => value === true || value === 'true';

const searchRegex = (value) => ({ $regex: value, $options: 'i' });

const buildQuery = ({ search, country, popular }) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: searchRegex(search) },
      { country: searchRegex(search) },
      { city: searchRegex(search) },
    ];
  }
  if (country) query.country = searchRegex(country);
  if (popular === 'true') query.isPopular = true;

  return query;
};

export const getDestinations = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const query = buildQuery(req.query);
  const skip = (page - 1) * limit;

  const [destinations, total] = await Promise.all([
    Destination.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Destination.countDocuments(query),
  ]);

  res.json({
    destinations,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getDestinationById = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) return res.status(404).json({ message: 'Destination not found' });
  res.json(destination);
});

export const createDestination = asyncHandler(async (req, res) => {
  const { name, country, description, image } = req.body;

  if (!name || !country || !description) {
    return res.status(400).json({ message: 'Name, country, and description are required' });
  }
  if (!image) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  const destination = await Destination.create({
    ...req.body,
    isPopular: toBoolean(req.body.isPopular),
  });

  res.status(201).json(destination);
});

export const updateDestination = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.isPopular !== undefined) data.isPopular = toBoolean(data.isPopular);

  const destination = await Destination.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!destination) return res.status(404).json({ message: 'Destination not found' });

  res.json(destination);
});

export const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) return res.status(404).json({ message: 'Destination not found' });

  await destination.deleteOne();
  res.json({ message: 'Destination deleted' });
});

export const getPopularDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ isPopular: true }).limit(6);
  res.json(destinations);
});
