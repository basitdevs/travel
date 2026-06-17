import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const isEmail = (email) => /^\S+@\S+\.\S+$/.test(email || '');

const userData = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  avatar: user.avatar,
  role: user.role,
  isBlocked: user.isBlocked,
  isVerified: user.isVerified,
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('wishlist');
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  if (req.body.email && req.body.email !== user.email) {
    if (!isEmail(req.body.email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    user.email = req.body.email;
  }

  if (req.body.avatar !== undefined) {
    user.avatar = req.body.avatar;
  }

  const updated = await user.save();
  res.json(userData(updated));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const tourId = req.params.tourId;
  const savedIndex = user.wishlist.findIndex((id) => id.toString() === tourId);

  if (savedIndex > -1) {
    user.wishlist.splice(savedIndex, 1);
  } else {
    user.wishlist.push(tourId);
  }

  await user.save();
  await user.populate('wishlist');
  res.json(user.wishlist);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Cannot block admin' });

  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user: userData(user) });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });

  await user.deleteOne();
  res.json({ message: 'User deleted' });
});
