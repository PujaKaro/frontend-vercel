import { julian, solar, moonposition, sidereal, planetposition } from 'astronomia';
import vsop87Bearth from 'astronomia/data/vsop87Bearth';
import vsop87Bmercury from 'astronomia/data/vsop87Bmercury';
import vsop87Bvenus from 'astronomia/data/vsop87Bvenus';
import vsop87Bmars from 'astronomia/data/vsop87Bmars';
import vsop87Bjupiter from 'astronomia/data/vsop87Bjupiter';
import vsop87Bsaturn from 'astronomia/data/vsop87Bsaturn';
import { DateTime } from 'luxon';
import { zodiacSigns } from './astrologyUtils';

/**
 * Convert a Date object → Julian Ephemeris Day (JED) for true ephemeris-based positions.
 * We'll use UTC internally; if birthDate is local, you must convert to UTC first.
 */
export function dateToJulianDayUTC(jsDate) {
  console.log('=== JULIAN DAY CALCULATION ===');
  console.log('Input date:', jsDate.toISOString());
  const Y = jsDate.getUTCFullYear();
  const M = jsDate.getUTCMonth() + 1;
  const D = jsDate.getUTCDate();
  const h = jsDate.getUTCHours() + jsDate.getUTCMinutes()/60 + jsDate.getUTCSeconds()/3600;
  const dayOfMonth = D + h/24.0;
  const jd = julian.CalendarGregorianToJD(Y, M, dayOfMonth);
  console.log('Julian Day calculation:', {
    year: Y,
    month: M,
    day: D,
    hour: h,
    dayOfMonth,
    julianDay: jd
  });
  return jd;
}

/**
 * Compute the Sun's true ecliptic longitude (in degrees, tropical) given a JS Date.
 */
export function tropicalSunLongitude(jsDate) {
  console.log('=== SUN LONGITUDE CALCULATION ===');
  console.log('Input date:', jsDate.toISOString());
  const jd = dateToJulianDayUTC(jsDate);
  
  // Simplified calculation of Sun's position
  // This is an approximation based on a simple formula
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Mean longitude of the Sun
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  
  // Mean anomaly of the Sun
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  
  // Eccentricity of Earth's orbit
  let e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
  
  // Sun's equation of center
  let C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
        + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
        + 0.000289 * Math.sin(3 * M * Math.PI / 180);
  
  // True longitude of the Sun
  let lambdaDeg = (L0 + C) % 360;
  if (lambdaDeg < 0) lambdaDeg += 360;
  
  console.log('Sun longitude:', {
    mean: L0.toFixed(2),
    equation: C.toFixed(2),
    degrees: lambdaDeg.toFixed(2)
  });
  
  return lambdaDeg;
}

/**
 * Compute the Moon's true ecliptic longitude (in degrees, tropical) given a JS Date.
 */
export function tropicalMoonLongitude(jsDate) {
  console.log('=== MOON LONGITUDE CALCULATION ===');
  console.log('Input date:', jsDate.toISOString());
  const jd = dateToJulianDayUTC(jsDate);
  
  // Simple implementation without library dependency
  // Using simplified ELP2000 theory
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Mean longitude of Moon
  let L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;
  
  // Mean elongation of the Moon
  let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000;
  
  // Mean anomaly of the Sun
  let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000;
  
  // Mean anomaly of the Moon
  let M_moon = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000;
  
  // Moon's argument of latitude
  let F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000;
  
  // Convert to radians for calculations
  const Drad = D * Math.PI / 180;
  const Mrad = M * Math.PI / 180;
  const M_moonRad = M_moon * Math.PI / 180;
  const Frad = F * Math.PI / 180;
  
  // Principal lunar perturbations
  let longitude_correction = 
    6.288774 * Math.sin(M_moonRad) +
    1.274027 * Math.sin(2 * Drad - M_moonRad) +
    0.658314 * Math.sin(2 * Drad) +
    0.213618 * Math.sin(2 * M_moonRad) +
    -0.185116 * Math.sin(Mrad) +
    -0.114332 * Math.sin(2 * Frad) +
    0.058793 * Math.sin(2 * Drad - 2 * M_moonRad) +
    0.057066 * Math.sin(2 * Drad - Mrad - M_moonRad) +
    0.053322 * Math.sin(2 * Drad + M_moonRad) +
    0.045758 * Math.sin(2 * Drad - Mrad) +
    -0.040923 * Math.sin(Mrad - M_moonRad) +
    -0.034720 * Math.sin(Drad) +
    -0.030383 * Math.sin(Mrad + M_moonRad);
  
  // Calculate final longitude
  let moonLon = (L + longitude_correction) % 360;
  if (moonLon < 0) moonLon += 360;
  
  console.log('Moon longitude:', {
    mean: L.toFixed(2),
    equation: longitude_correction.toFixed(2),
    degrees: moonLon.toFixed(2)
  });
  
  return moonLon;
}

/**
 * Compute approximate ecliptic longitude for other planets
 * This is still an approximation, but better than our previous approach
 */
export function planetEclipticLongitude(planetName, date) {
  // This is still an approximation as astronomia doesn't directly expose
  // all planetary positions without additional data files
  const jd = dateToJulianDayUTC(date);
  
  // Approximate planetary positions based on mean motion
  // These are rough approximations and should be replaced with proper VSOP87 calculations
  const planetaryPeriods = {
    'Mercury': 87.97,
    'Venus': 224.7,
    'Mars': 686.98,
    'Jupiter': 4332.59,
    'Saturn': 10759.22,
    'Rahu': 6793.48,
    'Ketu': 6793.48
  };
  
  const planetaryOffsets = {
    'Mercury': 252.3,
    'Venus': 181.2,
    'Mars': 355.4,
    'Jupiter': 34.3,
    'Saturn': 50.1,
    'Rahu': 103.5,
    'Ketu': 283.5
  };
  
  if (planetName === 'Sun') {
    return tropicalSunLongitude(date);
  } else if (planetName === 'Moon') {
    return tropicalMoonLongitude(date);
  } else if (planetName === 'Rahu') {
    // Lunar north node
    return calculateLunarNodeLongitude(date);
  } else if (planetName === 'Ketu') {
    // Lunar south node (opposite to Rahu)
    return (calculateLunarNodeLongitude(date) + 180) % 360;
  } else if (planetaryPeriods[planetName]) {
    // Calculate based on J2000 reference and mean motion
    const j2000 = 2451545.0; // January 1, 2000, at noon UTC
    const daysSinceJ2000 = jd - j2000;
    const meanMotion = 360 / planetaryPeriods[planetName]; // degrees per day
    const offset = planetaryOffsets[planetName] || 0;
    
    let position = (offset + daysSinceJ2000 * meanMotion) % 360;
    if (position < 0) position += 360;
    
    return position;
  }
  
  // Default to 0 if planet not recognized
  return 0;
}

/**
 * Calculate the approximate longitude of the lunar node (Rahu)
 */
export function calculateLunarNodeLongitude(date) {
  const jd = dateToJulianDayUTC(date);
  
  // Approximate Rahu position (lunar ascending node)
  // This is a simplified calculation and should be replaced with proper ephemeris
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Mean longitude of the ascending node
  let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000;
  
  // Normalize to 0-360
  omega = (omega % 360 + 360) % 360;
  
  return omega;
}

/**
 * Apply sidereal correction (ayanamsa) to convert from tropical to sidereal coordinates
 * Uses Lahiri ayanamsa which is standard in Vedic astrology
 */
export function applyAyanamsa(tropicalLonDeg, jsDate) {
  console.log('=== APPLYING AYANAMSA ===');
  console.log('Input:', {
    tropicalLongitude: tropicalLonDeg.toFixed(2),
    date: jsDate.toISOString()
  });
  const ayan = lahiriAyanamsa(jsDate);
  let siderealLon = (tropicalLonDeg - ayan) % 360;
  if (siderealLon < 0) siderealLon += 360;
  console.log('Sidereal conversion:', {
    tropical: tropicalLonDeg.toFixed(2),
    ayanamsa: ayan.toFixed(2),
    sidereal: siderealLon.toFixed(2)
  });
  return siderealLon;
}

/**
 * Calculate ascendant (lagna) given date, time, latitude, and longitude
 * @param {Date} jsDate - JavaScript Date object in UTC
 * @param {Number} latitude - Latitude in degrees
 * @param {Number} longitude - Longitude in degrees
 * @param {Boolean} isVedic - Whether to use Vedic (sidereal) or Western (tropical) system
 * @returns {Object} - Ascendant sign and degree
 */
export function calculateAscendantTrue(jsDate, latitude, longitude, isVedic = true) {
  console.log('=== ASCENDANT CALCULATION ===');
  console.log('Input:', {
    date: jsDate.toISOString(),
    latitude,
    longitude,
    system: isVedic ? 'Vedic (Sidereal)' : 'Western (Tropical)'
  });
  
  try {
    const jd = dateToJulianDayUTC(jsDate);
    const gmstRad = sidereal.apparent(jd);
    let gmstHour = (gmstRad * 12/Math.PI) % 24;
    if (gmstHour < 0) gmstHour += 24;
    console.log('Sidereal time:', {
      radians: gmstRad,
      hours: gmstHour.toFixed(2)
    });

    const lstHour = (gmstHour + longitude/15) % 24;
    console.log('Local sidereal time:', lstHour.toFixed(2));
    
    const thetaRad = (lstHour * 15) * Math.PI/180;
    const T = (jd - 2451545.0) / 36525;
    let epsDeg = 23.4392911111 
      - 0.0130041667 * T
      - 1.6666667e-07 * T*T
      + 5.0277778e-07 * T*T*T;
    const epsRad = epsDeg * Math.PI/180;
    const phiRad = latitude * Math.PI/180;

    console.log('Obliquity calculation:', {
      centuries: T,
      degrees: epsDeg.toFixed(2)
    });

    const ascRad = Math.atan2(
      Math.sin(thetaRad) * Math.cos(epsRad) + Math.tan(phiRad) * Math.sin(epsRad),
      Math.cos(thetaRad)
    );
    let ascTropDeg = (ascRad * 180/Math.PI) % 360;
    if (ascTropDeg < 0) ascTropDeg += 360;
    console.log('Tropical ascendant:', ascTropDeg.toFixed(2));

    // For Western astrology, use tropical coordinates (don't apply ayanamsa)
    // For Vedic astrology, convert to sidereal coordinates (apply ayanamsa)
    let finalAscDeg;
    if (isVedic) {
      finalAscDeg = applyAyanamsa(ascTropDeg, jsDate);
      console.log('Sidereal ascendant (after ayanamsa):', finalAscDeg.toFixed(2));
    } else {
      finalAscDeg = ascTropDeg;
      console.log('Using tropical ascendant (Western system):', finalAscDeg.toFixed(2));
    }
    
    const signIndex = Math.floor(finalAscDeg / 30);
    const degWithin = finalAscDeg % 30;
    
    const result = {
      sign: zodiacSigns[signIndex].name,
      degree: parseFloat(degWithin.toFixed(2))
    };
    
    console.log('Final ascendant:', result);
    return result;
    
  } catch (err) {
    console.error("Ascendant calculation error:", err);
    console.error("Error stack:", err.stack);
    return { sign: "Unknown", degree: 0 };
  }
}

/**
 * Given an ecliptic longitude in degrees, return a signName + degreeWithinSign (0-30).
 */
export function signsAndDegreesFromLongitude(eclLonDeg) {
  console.log('=== CONVERTING LONGITUDE TO SIGN AND DEGREE ===');
  console.log('Input longitude:', eclLonDeg.toFixed(2));
  const normalized = (eclLonDeg % 360 + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  const result = {
    sign: zodiacSigns[signIndex].name,
    degree: parseFloat(degree.toFixed(2))
  };
  console.log('Result:', result);
  return result;
}

/**
 * Check if a planet is retrograde
 * This is still an approximation and should be replaced with proper ephemeris calculations
 * @param {String} planetName - Name of the planet
 * @param {Date} jsDate - JavaScript Date object in UTC
 * @param {Boolean} isVedic - Whether to use Vedic (sidereal) or Western (tropical) system
 * @returns {Boolean} - Whether the planet is retrograde
 */
export function isRetrograde(planetName, jsDate, isVedic = true) {
  console.log('=== CHECKING RETROGRADE STATUS ===');
  console.log('Input:', {
    planet: planetName,
    date: jsDate.toISOString(),
    system: isVedic ? 'Vedic (Sidereal)' : 'Western (Tropical)'
  });
  
  if (planetName === 'Sun' || planetName === 'Moon') {
    console.log(`${planetName} is never retrograde`);
    return false;
  }
  
  if (planetName === 'Rahu' || planetName === 'Ketu') {
    console.log(`${planetName} is always considered retrograde in Vedic astrology`);
    return true;
  }

  const dms = 3 * 24 * 60 * 60 * 1000;
  const before = new Date(jsDate.getTime() - dms);
  const after = new Date(jsDate.getTime() + dms);

  let lonBefore, lonNow, lonAfter;

  // Calculate tropical longitudes
  let tropBefore, tropNow, tropAfter;
  
  switch(planetName) {
    case 'Mercury':
      tropBefore = tropicalMercuryLongitude(before);
      tropNow = tropicalMercuryLongitude(jsDate);
      tropAfter = tropicalMercuryLongitude(after);
      break;
    case 'Venus':
      tropBefore = tropicalVenusLongitude(before);
      tropNow = tropicalVenusLongitude(jsDate);
      tropAfter = tropicalVenusLongitude(after);
      break;
    case 'Mars':
      tropBefore = tropicalMarsLongitude(before);
      tropNow = tropicalMarsLongitude(jsDate);
      tropAfter = tropicalMarsLongitude(after);
      break;
    case 'Jupiter':
      tropBefore = tropicalJupiterLongitude(before);
      tropNow = tropicalJupiterLongitude(jsDate);
      tropAfter = tropicalJupiterLongitude(after);
      break;
    case 'Saturn':
      tropBefore = tropicalSaturnLongitude(before);
      tropNow = tropicalSaturnLongitude(jsDate);
      tropAfter = tropicalSaturnLongitude(after);
      break;
    default:
      console.log(`No calculation method for ${planetName}`);
      return false;
  }
  
  // Apply ayanamsa only for Vedic system
  if (isVedic) {
    lonBefore = applyAyanamsa(tropBefore, before);
    lonNow = applyAyanamsa(tropNow, jsDate);
    lonAfter = applyAyanamsa(tropAfter, after);
  } else {
    lonBefore = tropBefore;
    lonNow = tropNow;
    lonAfter = tropAfter;
  }

  console.log('Planet positions:', {
    before: lonBefore.toFixed(2),
    now: lonNow.toFixed(2),
    after: lonAfter.toFixed(2)
  });

  function arcDist(a, b) {
    let d = (b - a) % 360;
    if (d < -180) d += 360;
    if (d > 180) d -= 360;
    return d;
  }

  const d1 = arcDist(lonBefore, lonNow);
  const d2 = arcDist(lonNow, lonAfter);
  const isRetro = (d1 < 0 && d2 < 0);
  
  console.log('Retrograde calculation:', {
    d1: d1.toFixed(2),
    d2: d2.toFixed(2),
    isRetrograde: isRetro
  });
  
  return isRetro;
}

// A mapping of common cities to their coordinates
export const cityCoordinates = {
  "Mumbai, India": { lat: 19.076, lon: 72.8777 },
  "Delhi, India": { lat: 28.6139, lon: 77.209 },
  "Kolkata, India": { lat: 22.5726, lon: 88.3639 },
  "Chennai, India": { lat: 13.0827, lon: 80.2707 },
  "Bangalore, India": { lat: 12.9716, lon: 77.5946 },
  "Hyderabad, India": { lat: 17.385, lon: 78.4867 },
  "Ahmedabad, India": { lat: 23.0225, lon: 72.5714 },
  "Pune, India": { lat: 18.5204, lon: 73.8567 },
  "New York, USA": { lat: 40.7128, lon: -74.006 },
  "Los Angeles, USA": { lat: 34.0522, lon: -118.2437 },
  "London, UK": { lat: 51.5074, lon: -0.1278 },
  "Tokyo, Japan": { lat: 35.6762, lon: 139.6503 },
  "Bihar": { lat: 25.0961, lon: 85.3131 }, // Patna (capital of Bihar) coordinates
  "Madhubani": { lat: 26.3557, lon: 86.0715 }, // Madhubani, Bihar coordinates
  "Madhubani, India": { lat: 26.3557, lon: 86.0715 }, // Alternative format
  "Madhubani, Bihar": { lat: 26.3557, lon: 86.0715 }, // Alternative format
  "Madhubani, Bihar, India": { lat: 26.3557, lon: 86.0715 } // Alternative format
};

// Timezone offsets for common cities (in hours)
export const cityTimezones = {
  "Mumbai, India": "Asia/Kolkata",
  "Delhi, India": "Asia/Kolkata",
  "Kolkata, India": "Asia/Kolkata",
  "Chennai, India": "Asia/Kolkata",
  "Bangalore, India": "Asia/Kolkata",
  "Hyderabad, India": "Asia/Kolkata",
  "Ahmedabad, India": "Asia/Kolkata",
  "Pune, India": "Asia/Kolkata",
  "New York, USA": "America/New_York",
  "Los Angeles, USA": "America/Los_Angeles",
  "London, UK": "Europe/London",
  "Tokyo, Japan": "Asia/Tokyo",
  "Bihar": "Asia/Kolkata", // Bihar is in India's standard timezone
  "Madhubani": "Asia/Kolkata", // Madhubani is in India's standard timezone
  "Madhubani, India": "Asia/Kolkata", // Alternative format
  "Madhubani, Bihar": "Asia/Kolkata", // Alternative format
  "Madhubani, Bihar, India": "Asia/Kolkata" // Alternative format
};

// Common country timezone mapping for fallback
const countryTimezones = {
  "India": "Asia/Kolkata",
  "USA": "America/New_York",
  "UK": "Europe/London",
  "Japan": "Asia/Tokyo",
  "China": "Asia/Shanghai",
  "Australia": "Australia/Sydney",
  "Canada": "America/Toronto",
  "Germany": "Europe/Berlin",
  "France": "Europe/Paris",
  "Italy": "Europe/Rome",
  "Spain": "Europe/Madrid",
  "Russia": "Europe/Moscow",
  "Brazil": "America/Sao_Paulo",
  "South Africa": "Africa/Johannesburg"
};

/**
 * Convert local date and time to UTC based on city timezone
 */
export function localToUTC(dateStr, timeStr, city) {
  console.log('=== CONVERTING LOCAL TIME TO UTC ===');
  console.log('Input:', {
    date: dateStr,
    time: timeStr,
    city: city
  });
  
  if (!dateStr || !timeStr || !city) {
    console.error('Missing required data:', { dateStr, timeStr, city });
    throw new Error("Date, time, and city are required");
  }
  
  // Make lookup case-insensitive
  const cityLowerCase = city.toLowerCase();
  let tz = null;
  for (const cityName in cityTimezones) {
    if (cityName.toLowerCase() === cityLowerCase) {
      tz = cityTimezones[cityName];
      break;
    }
  }
  
  // If timezone not found directly, try to extract country for fallback
  if (!tz) {
    console.log('City timezone not found directly, attempting fallback...');
    // Try to extract country from city string
    for (const country in countryTimezones) {
      if (city.toLowerCase().includes(country.toLowerCase())) {
        tz = countryTimezones[country];
        console.log(`Found fallback timezone ${tz} based on country: ${country}`);
        break;
      }
    }
    
    // If still not found, default to India timezone for now
    // This is a simplification - in production you'd want a more sophisticated fallback
    if (!tz) {
      console.log('Using default timezone (Asia/Kolkata) as fallback');
      tz = "Asia/Kolkata";
    }
  }
  
  console.log('Using timezone:', tz);
  
  const dt = DateTime.fromFormat(
    `${dateStr} ${timeStr}`,
    'yyyy-MM-dd HH:mm',
    { zone: tz }
  );
  
  if (!dt.isValid) {
    console.error('Invalid date/time:', dt.invalidReason);
    throw new Error(`Invalid date/time or timezone: ${dateStr} ${timeStr} ${tz}`);
  }
  
  const utcDate = dt.toUTC().toJSDate();
  console.log('Converted to UTC:', utcDate.toISOString());
  return utcDate;
}

export function lahiriAyanamsa(jsDate) {
  console.log('=== AYANAMSA CALCULATION ===');
  console.log('Input date:', jsDate.toISOString());
  const jd = dateToJulianDayUTC(jsDate);
  const T = (jd - 2451545.0) / 36525;
  const ayan = 23.85664 + 1.396 * T + 0.000139 * T * T;
  console.log('Ayanamsa calculation:', {
    julianDay: jd,
    centuries: T,
    ayanamsa: ayan.toFixed(2)
  });
  return ayan;
}

/**
 * Direct calculation methods for planetary positions
 * These replace the problematic functions that relied on the planetposition library
 */

function tropicalMercuryLongitude(jsDate) {
  console.log('=== MERCURY LONGITUDE CALCULATION ===');
  console.log('Input date:', jsDate.toISOString());
  const jd = dateToJulianDayUTC(jsDate);
  
  // Simplified calculation for Mercury
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Mean longitude of Mercury
  let L = 252.25084 + 538101628.29 * T / 3600;
  L = L % 360;
  if (L < 0) L += 360;
  
  // Add a simple equation of center approximation
  const M = 174.7948 + 149472.6741 * T;  // Mean anomaly
  const Mrad = M * Math.PI / 180;
  const eqCenter = 23.4 * Math.sin(Mrad) + 2.9 * Math.sin(2 * Mrad) + 0.6 * Math.sin(3 * Mrad);
  
  let lonDeg = (L + eqCenter) % 360;
  if (lonDeg < 0) lonDeg += 360;
  
  console.log('Mercury longitude:', {
    mean: L.toFixed(2),
    equation: eqCenter.toFixed(2),
    degrees: lonDeg.toFixed(2)
  });
  
  return lonDeg;
}

function tropicalVenusLongitude(jsDate) {
  console.log('=== VENUS LONGITUDE CALCULATION ===');
  console.log('Input date:', jsDate.toISOString());
  const jd = dateToJulianDayUTC(jsDate);
  
  // Simplified calculation for Venus
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Mean longitude of Venus
  let L = 181.9798 + 58517.8156 * T;
  L = L % 360;
  if (L < 0) L += 360;
  
  // Add a simple equation of center approximation
  const M = 54.3842 + 58517.8039 * T;  // Mean anomaly
  const Mrad = M * Math.PI / 180;
  const eqCenter = 0.7 * Math.sin(Mrad) + 0.3 * Math.sin(2 * Mrad);
  
  let lonDeg = (L + eqCenter) % 360;
  if (lonDeg < 0) lonDeg += 360;
  
  console.log('Venus longitude:', {
    mean: L.toFixed(2),
    equation: eqCenter.toFixed(2),
    degrees: lonDeg.toFixed(2)
  });
  
  return lonDeg;
}

function tropicalMarsLongitude(jsDate) {
  console.log('=== MARS LONGITUDE CALCULATION ===');
  console.log('Input date:', jsDate.toISOString());
  const jd = dateToJulianDayUTC(jsDate);
  
  // Simplified calculation for Mars
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Mean longitude of Mars
  let L = 355.4332 + 19140.2993 * T;
  L = L % 360;
  if (L < 0) L += 360;
  
  // Add a simple equation of center approximation
  const M = 19.3856 + 19139.8585 * T;  // Mean anomaly
  const Mrad = M * Math.PI / 180;
  const eqCenter = 10.5 * Math.sin(Mrad) + 0.6 * Math.sin(2 * Mrad);
  
  let lonDeg = (L + eqCenter) % 360;
  if (lonDeg < 0) lonDeg += 360;
  
  console.log('Mars longitude:', {
    mean: L.toFixed(2),
    equation: eqCenter.toFixed(2),
    degrees: lonDeg.toFixed(2)
  });
  
  return lonDeg;
}

function tropicalJupiterLongitude(jsDate) {
  console.log('=== JUPITER LONGITUDE CALCULATION ===');
  console.log('Input date:', jsDate.toISOString());
  const jd = dateToJulianDayUTC(jsDate);
  
  // Simplified calculation for Jupiter
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Mean longitude of Jupiter
  let L = 34.3534 + 3034.9057 * T;
  L = L % 360;
  if (L < 0) L += 360;
  
  // Add a simple equation of center approximation
  const M = 14.3320 + 3034.9057 * T;  // Mean anomaly
  const Mrad = M * Math.PI / 180;
  const eqCenter = 5.2 * Math.sin(Mrad) + 0.4 * Math.sin(2 * Mrad);
  
  let lonDeg = (L + eqCenter) % 360;
  if (lonDeg < 0) lonDeg += 360;
  
  console.log('Jupiter longitude:', {
    mean: L.toFixed(2),
    equation: eqCenter.toFixed(2),
    degrees: lonDeg.toFixed(2)
  });
  
  return lonDeg;
}

function tropicalSaturnLongitude(jsDate) {
  console.log('=== SATURN LONGITUDE CALCULATION ===');
  console.log('Input date:', jsDate.toISOString());
  const jd = dateToJulianDayUTC(jsDate);
  
  // Simplified calculation for Saturn
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Mean longitude of Saturn
  let L = 50.0774 + 1222.1138 * T;
  L = L % 360;
  if (L < 0) L += 360;
  
  // Add a simple equation of center approximation
  const M = 89.0096 + 1221.5548 * T;  // Mean anomaly
  const Mrad = M * Math.PI / 180;
  const eqCenter = 6.4 * Math.sin(Mrad) + 0.2 * Math.sin(2 * Mrad);
  
  let lonDeg = (L + eqCenter) % 360;
  if (lonDeg < 0) lonDeg += 360;
  
  console.log('Saturn longitude:', {
    mean: L.toFixed(2),
    equation: eqCenter.toFixed(2),
    degrees: lonDeg.toFixed(2)
  });
  
  return lonDeg;
} 