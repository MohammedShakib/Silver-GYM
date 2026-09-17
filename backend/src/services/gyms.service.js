import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';

// Haversine distance calculation in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const searchGyms = async (filters) => {
  const { search, area, lat, lng, radius } = filters;
  
  const where = { status: 'ACTIVE' };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (area) {
    where.area = { contains: area, mode: 'insensitive' };
  }

  let gyms = await prisma.gym.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      amenities: { include: { amenity: true }, take: 5 },
      reviews: true // For rating calculation
    }
  });

  // Calculate rating
  gyms = gyms.map(gym => {
    const reviewCount = gym.reviews.length;
    const rating = reviewCount > 0 
      ? gym.reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount
      : 0;
    
    let distance = null;
    if (lat && lng && gym.latitude && gym.longitude) {
      distance = getDistance(parseFloat(lat), parseFloat(lng), gym.latitude, gym.longitude);
    }

    return {
      ...gym,
      rating: parseFloat(rating.toFixed(1)),
      reviewCount,
      distance,
      reviews: undefined
    };
  });

  // Filter by distance if requested
  if (lat && lng && radius) {
    gyms = gyms.filter(g => g.distance !== null && g.distance <= parseFloat(radius));
    // Sort by distance
    gyms.sort((a, b) => a.distance - b.distance);
  }

  return gyms;
};

export const getGym = async (idOrSlug) => {
  const gym = await prisma.gym.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { slug: idOrSlug }
      ]
    },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      amenities: { include: { amenity: true } },
      openingHours: true,
      trainers: true,
      reviews: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!gym) {
    throw new ApiError(404, ErrorCodes.GYM_NOT_FOUND, 'Gym not found');
  }

  const reviewCount = gym.reviews.length;
  const rating = reviewCount > 0 
    ? gym.reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount
    : 0;

  return {
    ...gym,
    rating: parseFloat(rating.toFixed(1)),
    reviewCount
  };
};
