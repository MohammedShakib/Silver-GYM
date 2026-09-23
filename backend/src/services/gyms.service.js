import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';

import { calculateDistanceKm, isWithinBounds } from '../utils/geo.js';
import { getOpenStatus } from '../utils/time.js';

const TIER_ORDER = { 'STANDARD': 0, 'ACTIVE': 1, 'PREMIUM': 2 };

export const searchGyms = async (filters) => {
  const { search, area, lat, lng, radius, north, south, east, west, crowd, ratingMin, amenities, includedOnly, openNow, sort, page = 1, limit = 50, userId } = filters;
  
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

  if (crowd) {
    where.crowd = crowd.toUpperCase();
  }

  // Amenity filtering (ALL selected)
  if (amenities) {
    const amenitySlugs = amenities.split(',').map(s => s.trim());
    if (amenitySlugs.length > 0) {
      where.amenities = {
        // Find gyms where every requested amenity slug is present
        // Actually, Prisma lacks a simple 'contains all' for many-to-many, we can filter in JS or use AND
        AND: amenitySlugs.map(slug => ({
          some: { amenity: { slug } }
        }))
      };
    }
  }

  let gyms = await prisma.gym.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      amenities: { include: { amenity: true }, take: 5 },
      reviews: true,
      openingHours: true
    }
  });

  // Calculate rating, distance, open status
  gyms = gyms.map(gym => {
    const reviewCount = gym.reviews.length;
    const rating = reviewCount > 0 
      ? gym.reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount
      : 0;
    
    let distance = null;
    if (lat && lng && gym.latitude && gym.longitude) {
      distance = calculateDistanceKm(parseFloat(lat), parseFloat(lng), gym.latitude, gym.longitude);
    }

    const { status: openStatus, todayClosingTime } = getOpenStatus(gym.openingHours);

    return {
      ...gym,
      rating: parseFloat(rating.toFixed(1)),
      reviewCount,
      distance,
      openStatus,
      todayClosingTime,
      reviews: undefined,
      openingHours: undefined // exclude from list DTO
    };
  });

  // ratingMin filter
  if (ratingMin) {
    const min = parseFloat(ratingMin);
    gyms = gyms.filter(g => g.rating >= min);
  }

  // openNow filter
  if (openNow === 'true') {
    gyms = gyms.filter(g => g.openStatus === 'OPEN' || g.openStatus === 'CLOSING_SOON');
  }

  // Geospatial filtering: Viewport takes precedence
  if (north && south && east && west) {
    const n = parseFloat(north), s = parseFloat(south), e = parseFloat(east), w = parseFloat(west);
    gyms = gyms.filter(g => isWithinBounds(g.latitude, g.longitude, n, s, e, w));
  } else if (lat && lng && radius) {
    const r = parseFloat(radius);
    gyms = gyms.filter(g => g.distance !== null && g.distance <= r);
  }

  // Membership access filtering
  if (userId) {
    const activeMembership = await prisma.membership.findFirst({
      where: { memberId: userId, status: 'ACTIVE' },
      include: { plan: true }
    });
    const userTier = activeMembership?.plan?.accessTier || 'NONE';
    const userTierLevel = TIER_ORDER[userTier] ?? -1;

    gyms = gyms.map(g => {
      const gymTierLevel = TIER_ORDER[g.accessTier] ?? 0;
      let accessStatus = 'UNAVAILABLE';
      
      if (userTierLevel >= gymTierLevel) {
        accessStatus = 'INCLUDED';
      } else if (userTierLevel > -1) {
        accessStatus = 'UPGRADE_REQUIRED';
      }
      
      return { ...g, accessStatus };
    });

    if (includedOnly === 'true') {
      gyms = gyms.filter(g => g.accessStatus === 'INCLUDED');
    }
  }

  // Sorting
  if (sort === 'NEAREST') {
    gyms.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
  } else if (sort === 'HIGHEST_RATED') {
    gyms.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'LEAST_CROWDED') {
    const crowdScore = { 'LOW': 0, 'MODERATE': 1, 'BUSY': 2, 'FULL': 3 };
    gyms.sort((a, b) => (crowdScore[a.crowd] || 0) - (crowdScore[b.crowd] || 0));
  } else if (sort === 'RECOMMENDED' || !sort) {
    // Simple deterministic score
    gyms.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      if (a.accessStatus === 'INCLUDED') scoreA += 100;
      if (b.accessStatus === 'INCLUDED') scoreB += 100;
      if (a.openStatus === 'OPEN' || a.openStatus === 'CLOSING_SOON') scoreA += 50;
      if (b.openStatus === 'OPEN' || b.openStatus === 'CLOSING_SOON') scoreB += 50;
      if (a.crowd === 'LOW') scoreA += 30;
      if (b.crowd === 'LOW') scoreB += 30;
      if (a.distance !== null) scoreA -= a.distance * 10;
      if (b.distance !== null) scoreB -= b.distance * 10;
      scoreA += a.rating * 5;
      scoreB += b.rating * 5;
      return scoreB - scoreA;
    });
  }

  // Pagination
  const p = parseInt(page, 10);
  const l = parseInt(limit, 10);
  const startIndex = (p - 1) * l;
  
  return gyms.slice(startIndex, startIndex + l);
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
