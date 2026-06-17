export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
  heroAlt: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80',
  auth: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  authRegister: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
  about: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
  contact: 'https://images.unsplash.com/photo-1436491865339-9a4a5c08d065?w=1920&q=80',
  destinations: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
  newsletter: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1920&q=80',
  defaultTour: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  defaultDestination: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  placeholder: 'https://images.unsplash.com/photo-1436491865339-9a4a5c08d065?w=800&q=80',
  avatars: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  ],
  team: [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    'https://images.unsplash.com/photo-1519081908943-6283ab57d0fe?w=400&q=80',
  ],
};

export const unsplash = (url, width = 800) => {
  if (!url) return IMAGES.placeholder;
  if (!url.includes('unsplash.com')) return url;
  const base = url.split('?')[0];
  return `${base}?w=${width}&q=80&auto=format&fit=crop`;
};
