import Contact from '../models/Contact.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendEmail, contactNotificationEmail, contactAutoReplyEmail } from '../utils/sendEmail.js';

const isEmail = (email) => /^\S+@\S+\.\S+$/.test(email || '');

const sendContactEmails = (contact) =>
  Promise.all([
    sendEmail(contactNotificationEmail(contact)),
    sendEmail(contactAutoReplyEmail(contact)),
  ]);

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  const contact = await Contact.create(req.body);
  const [notification, autoReply] = await sendContactEmails(contact);

  res.status(201).json({
    message: 'Message sent successfully',
    contact,
    email: {
      notificationSent: notification.success,
      autoReplySent: autoReply.success,
    },
  });
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

export const markContactRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!contact) return res.status(404).json({ message: 'Message not found' });
  res.json(contact);
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Message not found' });
  await contact.deleteOne();
  res.json({ message: 'Message deleted' });
});
