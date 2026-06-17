import { unsplash, IMAGES } from './images';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const getImageUrl = (path, width = 800) => {
  if (!path) return unsplash(IMAGES.defaultTour, width);
  if (path.startsWith('http')) return unsplash(path, width);
  return `${API_BASE}${path}`;
};

export const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'beach', label: 'Beach' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'city', label: 'City' },
];

export const BOOKING_STATUS = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  confirmed: { label: 'Confirmed', color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
  completed: { label: 'Completed', color: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
};

export const downloadInvoice = (booking) => {
  const content = `
WANDERLUX TRAVEL AGENCY
========================
Invoice: ${booking.invoiceNumber}
Date: ${formatDate(booking.createdAt)}

Tour: ${booking.tour?.title || 'N/A'}
Travel Date: ${formatDate(booking.travelDate)}
Travelers: ${booking.travelers}
Total: ${formatPrice(booking.totalPrice)}
Status: ${booking.status}

Thank you for choosing WanderLux!
  `.trim();

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${booking.invoiceNumber}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};
