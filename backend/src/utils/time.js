/**
 * Determine if a gym is currently open based on its opening hours and the provided timezone.
 * 
 * @param {Array} openingHours - Array of GymOpeningHour objects for the gym.
 * @param {String} timezone - Timezone to evaluate against, e.g. 'Asia/Dhaka'.
 * @returns {Object} { status: 'OPEN' | 'CLOSING_SOON' | 'CLOSED', todayOpenTime, todayCloseTime }
 */
export const getOpenStatus = (openingHours, timezone = 'Asia/Dhaka') => {
  if (!openingHours || openingHours.length === 0) {
    return { status: 'CLOSED', todayOpenTime: null, todayCloseTime: null };
  }

  const now = new Date();
  
  // Get current day and time in the specified timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const currentDay = parts.find(p => p.type === 'weekday').value;
  const currentHour = parseInt(parts.find(p => p.type === 'hour').value, 10);
  const currentMinute = parseInt(parts.find(p => p.type === 'minute').value, 10);
  const currentTimeMins = currentHour * 60 + currentMinute;
  
  // Find today's schedule
  const todaySchedule = openingHours.find(h => h.dayOfWeek === currentDay);
  
  if (!todaySchedule || todaySchedule.isClosed || !todaySchedule.openTime || !todaySchedule.closeTime) {
    return { status: 'CLOSED', todayOpenTime: null, todayCloseTime: null };
  }
  
  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };
  
  const openMins = parseTime(todaySchedule.openTime);
  const closeMins = parseTime(todaySchedule.closeTime);
  
  let isOpen = false;
  let isClosingSoon = false;
  
  if (closeMins < openMins) {
    // Overnight hours (e.g., 18:00 to 02:00)
    // It's open if time is >= openTime OR time <= closeTime
    if (currentTimeMins >= openMins || currentTimeMins <= closeMins) {
      isOpen = true;
      // Closing soon check
      if (currentTimeMins <= closeMins && (closeMins - currentTimeMins) <= 60) {
        isClosingSoon = true;
      }
    }
  } else {
    // Normal hours
    if (currentTimeMins >= openMins && currentTimeMins <= closeMins) {
      isOpen = true;
      if ((closeMins - currentTimeMins) <= 60) {
        isClosingSoon = true;
      }
    }
  }
  
  let status = 'CLOSED';
  if (isOpen) {
    status = isClosingSoon ? 'CLOSING_SOON' : 'OPEN';
  }

  // Handle 24/7 explicit case
  if (todaySchedule.openTime === '00:00' && todaySchedule.closeTime === '23:59') {
    status = 'OPEN';
  }

  return { 
    status, 
    todayOpenTime: todaySchedule.openTime, 
    todayCloseTime: todaySchedule.closeTime 
  };
};
