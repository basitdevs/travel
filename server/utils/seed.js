import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Tour from '../models/Tour.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Contact from '../models/Contact.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Destination.deleteMany(),
      Tour.deleteMany(),
      Review.deleteMany(),
      Booking.deleteMany(),
      Contact.deleteMany(),
    ]);

    console.log('Cleared existing data...');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@travelagency.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
      phone: '+1 555-0100',
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      isVerified: true,
      phone: '+1 555-0200',
    });

    console.log('Users created...');

    const destinations = await Destination.insertMany([
      {
        name: 'Santorini',
        country: 'Greece',
        city: 'Santorini',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
        description: 'Iconic white-washed buildings and stunning sunsets over the Aegean Sea.',
        isPopular: true,
        tourCount: 3,
      },
      {
        name: 'Bali',
        country: 'Indonesia',
        city: 'Ubud',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        description: 'Tropical paradise with lush rice terraces, temples, and pristine beaches.',
        isPopular: true,
        tourCount: 4,
      },
      {
        name: 'Swiss Alps',
        country: 'Switzerland',
        city: 'Zermatt',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
        description: 'Majestic mountain peaks, world-class skiing, and charming alpine villages.',
        isPopular: true,
        tourCount: 2,
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        city: 'Tokyo',
        image: 'https://images.unsplash.com/photo-1540959733335-eab4deabeeaf?w=800',
        description: 'A vibrant blend of ancient traditions and cutting-edge modernity.',
        isPopular: true,
        tourCount: 3,
      },
      {
        name: 'Maldives',
        country: 'Maldives',
        city: 'Malé',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
        description: 'Crystal-clear waters, overwater bungalows, and pristine coral reefs.',
        isPopular: true,
        tourCount: 2,
      },
      {
        name: 'Paris',
        country: 'France',
        city: 'Paris',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        description: 'The City of Light — art, cuisine, and romance at every corner.',
        isPopular: true,
        tourCount: 3,
      },
      {
        name: 'Dubai',
        country: 'UAE',
        city: 'Dubai',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        description: 'Futuristic skyline, luxury shopping, and desert adventures.',
        isPopular: false,
        tourCount: 2,
      },
      {
        name: 'Machu Picchu',
        country: 'Peru',
        city: 'Cusco',
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
        description: 'Ancient Incan citadel perched high in the Andes mountains.',
        isPopular: true,
        tourCount: 1,
      },
    ]);

    console.log('Destinations created...');

    const futureDate = (days) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d;
    };

    const tours = await Tour.insertMany([
      {
        title: 'Santorini Sunset Escape',
        description: 'Experience the magic of Santorini with private villa stays, wine tasting tours, and sunset sailing on the caldera. Explore Oia\'s charming streets and indulge in authentic Greek cuisine.',
        destination: destinations[0]._id,
        country: 'Greece',
        city: 'Santorini',
        images: [
          'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200',
          'https://images.unsplash.com/photo-1570077186670-a1ff977804b9?w=1200',
        ],
        duration: 7,
        price: 2499,
        category: 'luxury',
        rating: 4.8,
        reviewCount: 24,
        availableDates: [futureDate(30), futureDate(60), futureDate(90)],
        includedServices: ['Airport transfers', '5-star hotel', 'Daily breakfast', 'Wine tasting tour', 'Sunset cruise'],
        excludedServices: ['International flights', 'Travel insurance', 'Personal expenses'],
        hotelInfo: 'Canaves Oia Suites - 5 Star Luxury',
        isFeatured: true,
        isActive: true,
      },
      {
        title: 'Bali Wellness Retreat',
        description: 'Rejuvenate your mind and body in the heart of Ubud. Yoga sessions, spa treatments, temple visits, and organic farm-to-table dining in a serene tropical setting.',
        destination: destinations[1]._id,
        country: 'Indonesia',
        city: 'Ubud',
        images: [
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
          'https://images.unsplash.com/photo-1555404738-4f2791b96d12?w=1200',
        ],
        duration: 10,
        price: 1899,
        category: 'beach',
        rating: 4.9,
        reviewCount: 31,
        availableDates: [futureDate(20), futureDate(50), futureDate(80)],
        includedServices: ['Boutique resort', 'Daily yoga', 'Spa treatments', 'Temple tours', 'All meals'],
        excludedServices: ['Flights', 'Visa fees', 'Optional activities'],
        hotelInfo: 'COMO Shambhala Estate - Wellness Resort',
        isFeatured: true,
        isActive: true,
      },
      {
        title: 'Swiss Alps Adventure',
        description: 'Conquer the peaks of the Swiss Alps with guided hiking, glacier tours, and cozy chalet stays. Experience the Matterhorn and Jungfrau region.',
        destination: destinations[2]._id,
        country: 'Switzerland',
        city: 'Zermatt',
        images: [
          'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        ],
        duration: 8,
        price: 3299,
        category: 'adventure',
        rating: 4.7,
        reviewCount: 18,
        availableDates: [futureDate(40), futureDate(70)],
        includedServices: ['Mountain guide', 'Chalet accommodation', 'Lift passes', 'Equipment rental', 'Half-board meals'],
        excludedServices: ['Flights', 'Travel insurance', 'Personal gear'],
        hotelInfo: 'Hotel Monte Rosa - Alpine Chalet',
        isFeatured: true,
        isActive: true,
      },
      {
        title: 'Tokyo Cultural Discovery',
        description: 'Immerse yourself in Japanese culture from ancient temples to neon-lit streets. Tea ceremonies, sushi making classes, and bullet train experiences.',
        destination: destinations[3]._id,
        country: 'Japan',
        city: 'Tokyo',
        images: [
          'https://images.unsplash.com/photo-1540959733335-eab4deabeeaf?w=1200',
          'https://images.unsplash.com/photo-1493976040374-85c8e712f1f9?w=1200',
        ],
        duration: 12,
        price: 2799,
        category: 'cultural',
        rating: 4.9,
        reviewCount: 42,
        availableDates: [futureDate(25), futureDate(55), futureDate(85)],
        includedServices: ['JR Pass', 'Ryokan stay', 'Guided tours', 'Cultural workshops', 'Daily breakfast'],
        excludedServices: ['International flights', 'Lunch & dinner', 'Personal shopping'],
        hotelInfo: 'Park Hyatt Tokyo - Luxury Hotel',
        isFeatured: true,
        isActive: true,
      },
      {
        title: 'Maldives Overwater Paradise',
        description: 'Stay in a stunning overwater villa surrounded by turquoise lagoons. Snorkeling, diving, spa treatments, and private beach dinners under the stars.',
        destination: destinations[4]._id,
        country: 'Maldives',
        city: 'Malé',
        images: [
          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200',
          'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200',
        ],
        duration: 6,
        price: 4599,
        category: 'luxury',
        rating: 5.0,
        reviewCount: 15,
        availableDates: [futureDate(35), futureDate(65)],
        includedServices: ['Overwater villa', 'All-inclusive meals', 'Snorkeling gear', 'Spa credit', 'Seaplane transfer'],
        excludedServices: ['International flights', 'Diving certification', 'Premium alcohol'],
        hotelInfo: 'Conrad Maldives - Overwater Villa',
        isFeatured: true,
        isActive: true,
      },
      {
        title: 'Paris Romance Getaway',
        description: 'Fall in love with Paris on this romantic journey. Eiffel Tower dinner, Louvre private tour, Seine river cruise, and charming Montmartre exploration.',
        destination: destinations[5]._id,
        country: 'France',
        city: 'Paris',
        images: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
          'https://images.unsplash.com/photo-1499856871958-5b96275439d0?w=1200',
        ],
        duration: 5,
        price: 2199,
        category: 'city',
        rating: 4.6,
        reviewCount: 28,
        availableDates: [futureDate(15), futureDate(45), futureDate(75)],
        includedServices: ['Boutique hotel', 'Seine cruise', 'Museum passes', 'Wine & cheese tour', 'Daily breakfast'],
        excludedServices: ['Flights', 'Lunch & dinner', 'Shopping'],
        hotelInfo: 'Le Meurice - Palace Hotel',
        isFeatured: false,
        isActive: true,
      },
      {
        title: 'Dubai Luxury Experience',
        description: 'Experience the pinnacle of luxury in Dubai. Desert safari, Burj Khalifa, yacht cruise, and world-class shopping at the Dubai Mall.',
        destination: destinations[6]._id,
        country: 'UAE',
        city: 'Dubai',
        images: [
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
          'https://images.unsplash.com/photo-1582672060674-bc2bd0a75893?w=1200',
        ],
        duration: 6,
        price: 2999,
        category: 'luxury',
        rating: 4.5,
        reviewCount: 12,
        availableDates: [futureDate(22), futureDate(52)],
        includedServices: ['5-star hotel', 'Desert safari', 'Burj Khalifa tickets', 'Yacht cruise', 'Airport VIP'],
        excludedServices: ['Flights', 'Shopping', 'Premium dining'],
        hotelInfo: 'Burj Al Arab - 7 Star Hotel',
        isFeatured: false,
        isActive: true,
      },
      {
        title: 'Machu Picchu Expedition',
        description: 'Trek the legendary Inca Trail to Machu Picchu. Expert guides, porter support, and breathtaking Andean landscapes on this once-in-a-lifetime adventure.',
        destination: destinations[7]._id,
        country: 'Peru',
        city: 'Cusco',
        images: [
          'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200',
          'https://images.unsplash.com/photo-1526392060635-9d8bd2460256?w=1200',
        ],
        duration: 9,
        price: 3499,
        category: 'adventure',
        rating: 4.8,
        reviewCount: 22,
        availableDates: [futureDate(45), futureDate(90)],
        includedServices: ['Inca Trail permit', 'Expert guide', 'Camping gear', 'All meals on trek', 'Cusco hotel'],
        excludedServices: ['Flights', 'Travel insurance', 'Tips'],
        hotelInfo: 'Belmond Sanctuary Lodge - Machu Picchu',
        isFeatured: true,
        isActive: true,
      },
      {
        title: 'Bali Surf & Beach Tour',
        description: 'Catch the perfect wave in Bali\'s best surf spots. From beginner lessons to advanced breaks, plus beach hopping and island temple visits.',
        destination: destinations[1]._id,
        country: 'Indonesia',
        city: 'Seminyak',
        images: [
          'https://images.unsplash.com/photo-1555404738-4f2791b96d12?w=1200',
        ],
        duration: 7,
        price: 1299,
        category: 'beach',
        rating: 4.4,
        reviewCount: 19,
        availableDates: [futureDate(18), futureDate(48)],
        includedServices: ['Beach resort', 'Surf lessons', 'Board rental', 'Island tour', 'Breakfast'],
        excludedServices: ['Flights', 'Other meals', 'Travel insurance'],
        hotelInfo: 'Potato Head Beach Club Resort',
        isFeatured: false,
        isActive: true,
      },
    ]);

    console.log('Tours created...');

    await Review.insertMany([
      { user: user._id, tour: tours[0]._id, rating: 5, comment: 'Absolutely breathtaking! The sunset cruise was the highlight of our trip.' },
      { user: user._id, tour: tours[1]._id, rating: 5, comment: 'Best wellness retreat I\'ve ever experienced. The yoga sessions were transformative.' },
      { user: user._id, tour: tours[3]._id, rating: 5, comment: 'Tokyo exceeded all expectations. The cultural workshops were incredible.' },
    ]);

    await Booking.insertMany([
      {
        user: user._id,
        tour: tours[0]._id,
        travelDate: futureDate(30),
        travelers: 2,
        totalPrice: 4998,
        status: 'confirmed',
        invoiceNumber: `INV-${Date.now()}-A1`,
      },
      {
        user: user._id,
        tour: tours[1]._id,
        travelDate: futureDate(20),
        travelers: 1,
        totalPrice: 1899,
        status: 'pending',
        invoiceNumber: `INV-${Date.now()}-B2`,
      },
    ]);

    user.wishlist = [tours[2]._id, tours[4]._id];
    await user.save();

    await Contact.insertMany([
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1 555-0300',
        message: 'I\'m interested in a custom honeymoon package to the Maldives. Can you help?',
      },
      {
        name: 'Michael Chen',
        email: 'michael@example.com',
        phone: '+1 555-0400',
        message: 'Do you offer group discounts for corporate retreats in Bali?',
      },
    ]);

    console.log('Seed data created successfully!');
    console.log('\n--- Login Credentials ---');
    console.log('Admin: admin@travelagency.com / admin123');
    console.log('User:  user@example.com / user123');
    console.log('-------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
