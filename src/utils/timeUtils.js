// Time, Timezone, Solar & Formatting Utilities

export const POPULAR_WORLD_CITIES = [
  { city: 'UTC / GMT', zone: 'UTC', country: 'Global Standard', lat: 51.47, lon: 0 },
  { city: 'London', zone: 'Europe/London', country: 'United Kingdom', lat: 51.50, lon: -0.12 },
  { city: 'Paris', zone: 'Europe/Paris', country: 'France', lat: 48.85, lon: 2.35 },
  { city: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan', lat: 35.67, lon: 139.65 },
  { city: 'New York', zone: 'America/New_York', country: 'United States', lat: 40.71, lon: -74.00 },
  { city: 'Los Angeles', zone: 'America/Los_Angeles', country: 'United States', lat: 34.05, lon: -118.24 },
  { city: 'Sydney', zone: 'Australia/Sydney', country: 'Australia', lat: -33.86, lon: 151.20 },
  { city: 'Dubai', zone: 'Asia/Dubai', country: 'United Arab Emirates', lat: 25.20, lon: 55.27 },
  { city: 'Singapore', zone: 'Asia/Singapore', country: 'Singapore', lat: 1.35, lon: 103.81 },
  { city: 'Hong Kong', zone: 'Asia/Hong_Kong', country: 'China', lat: 22.31, lon: 114.16 },
  { city: 'Mumbai', zone: 'Asia/Kolkata', country: 'India', lat: 19.07, lon: 72.87 },
  { city: 'Sao Paulo', zone: 'America/Sao_Paulo', country: 'Brazil', lat: -23.55, lon: -46.63 },
  { city: 'Berlin', zone: 'Europe/Berlin', country: 'Germany', lat: 52.52, lon: 13.40 },
  { city: 'Toronto', zone: 'America/Toronto', country: 'Canada', lat: 43.65, lon: -79.38 },
  { city: 'Cairo', zone: 'Africa/Cairo', country: 'Egypt', lat: 30.04, lon: 31.23 },
  { city: 'Seoul', zone: 'Asia/Seoul', country: 'South Korea', lat: 37.56, lon: 126.97 },
  { city: 'Bangkok', zone: 'Asia/Bangkok', country: 'Thailand', lat: 13.75, lon: 100.50 },
  { city: 'Auckland', zone: 'Pacific/Auckland', country: 'New Zealand', lat: -36.84, lon: 174.76 },
  { city: 'Honolulu', zone: 'Pacific/Honolulu', country: 'United States', lat: 21.30, lon: -157.85 },
  { city: 'Reykjavik', zone: 'Atlantic/Reykjavik', country: 'Iceland', lat: 64.14, lon: -21.94 }
];

// Helper: Format Ordinal Number (e.g., 1st, 2nd, 15th)
export function getOrdinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Get time details for specific timezone with offset
export function getTimeInTimezone(dateObj, timeZone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const parts = formatter.formatToParts(dateObj);
    const dateMap = {};
    parts.forEach(p => dateMap[p.type] = p.value);

    const tzDate = new Date(
      `${dateMap.year}-${dateMap.month}-${dateMap.day}T${dateMap.hour}:${dateMap.minute}:${dateMap.second}`
    );

    // Calculate hour in 12h & 24h
    const hour24 = parseInt(dateMap.hour, 10);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';

    return {
      dateObj: tzDate,
      hour24,
      hour12,
      minute: parseInt(dateMap.minute, 10),
      second: parseInt(dateMap.second, 10),
      ampm,
      dateString: `${dateMap.year}-${dateMap.month}-${dateMap.day}`,
      time24String: `${dateMap.hour}:${dateMap.minute}:${dateMap.second}`,
      time12String: `${String(hour12).padStart(2, '0')}:${dateMap.minute}:${dateMap.second} ${ampm}`
    };
  } catch (e) {
    // Fallback if timezone is invalid
    return {
      dateObj: dateObj,
      hour24: dateObj.getHours(),
      hour12: dateObj.getHours() % 12 || 12,
      minute: dateObj.getMinutes(),
      second: dateObj.getSeconds(),
      ampm: dateObj.getHours() >= 12 ? 'PM' : 'AM',
      dateString: dateObj.toISOString().split('T')[0],
      time24String: dateObj.toTimeString().split(' ')[0],
      time12String: dateObj.toLocaleTimeString()
    };
  }
}

// Calculate timezone hour offset relative to local system time
export function getTimezoneOffsetHours(dateObj, targetZone) {
  try {
    const localTime = dateObj.getTime();
    const targetTimeStr = dateObj.toLocaleString('en-US', { timeZone: targetZone });
    const targetTime = new Date(targetTimeStr).getTime();
    const diffHours = (targetTime - localTime) / (1000 * 60 * 60);
    return Math.round(diffHours * 2) / 2; // round to nearest half-hour
  } catch (e) {
    return 0;
  }
}

// Format Offset Badge text (e.g. "+5.5 hrs", "-3 hrs", "Same Time")
export function formatOffsetBadge(offsetHours) {
  if (offsetHours === 0) return 'Same Time';
  const sign = offsetHours > 0 ? '+' : '';
  return `${sign}${offsetHours} hrs`;
}

// Determine if it's Day or Night in timezone (rough solar calculation: 06:00 to 18:00 is daytime)
export function getDayNightStatus(hour24) {
  if (hour24 >= 6 && hour24 < 18) {
    return { isDay: true, status: 'Daytime', icon: 'sun' };
  } else if (hour24 >= 18 && hour24 < 20) {
    return { isDay: true, status: 'Sunset / Dusk', icon: 'sunset' };
  } else if (hour24 >= 5 && hour24 < 6) {
    return { isDay: true, status: 'Sunrise / Dawn', icon: 'sunrise' };
  } else {
    return { isDay: false, status: 'Nighttime', icon: 'moon' };
  }
}

// Calculate Year Progress Percentage
export function getYearProgress(dateObj) {
  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const endOfYear = new Date(dateObj.getFullYear() + 1, 0, 1);
  const progress = (dateObj - startOfYear) / (endOfYear - startOfYear);
  return (progress * 100).toFixed(2);
}

// Calculate Day Progress Percentage (0 - 100%)
export function getDayProgress(dateObj) {
  const secondsInDay = dateObj.getHours() * 3600 + dateObj.getMinutes() * 60 + dateObj.getSeconds();
  return ((secondsInDay / 86400) * 100).toFixed(1);
}

// Solar Angle Simulation (0 to 180 degrees arc for sun across sky)
export function getSolarPositionArc(dateObj) {
  const hours = dateObj.getHours() + dateObj.getMinutes() / 60;
  // 6:00 AM (0 deg) -> 12:00 PM (90 deg) -> 6:00 PM (180 deg)
  let angle = ((hours - 6) / 12) * 180;
  if (angle < 0) angle = 0;
  if (angle > 180) angle = 180;

  const isNight = hours < 6 || hours >= 18;
  return {
    angleDegrees: angle,
    isNight,
    sunElevation: Math.sin((angle * Math.PI) / 180) * 90
  };
}
