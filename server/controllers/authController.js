import crypto from 'crypto';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail, resetPasswordEmail, verificationEmail } from '../utils/sendEmail.js';

const isEmail = (email) => /^\S+@\S+\.\S+$/.test(email || '');

const userData = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  isVerified: user.isVerified,
});

const sendAuth = (res, user, status = 200, message) => {
  res.status(status).json({
    ...(message ? { message } : {}),
    token: generateToken(user._id),
    user: userData(user),
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({ name, email, password, verificationToken });
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  await sendEmail(verificationEmail(user, verifyUrl));
  sendAuth(res, user, 201, 'Registration successful. Please check your email to verify your account.');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  const passwordMatches = user ? await user.comparePassword(password) : false;

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  if (user.isBlocked) {
    return res.status(403).json({ message: 'Your account has been blocked' });
  }

  sendAuth(res, user);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const message = 'If an account exists, a reset link has been sent';

  if (!isEmail(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.json({ message });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail(resetPasswordEmail(user, resetUrl));

  res.json({ message });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    message: 'Password reset successful',
    token: generateToken(user._id),
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });

  if (!user) {
    return res.status(400).json({ message: 'Invalid verification token' });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ message: 'Email verified successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('wishlist');
  res.json(user);
});
