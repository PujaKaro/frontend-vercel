/**
 * Astrology Utilities
 * 
 * This file contains utility functions for generating birth charts and other astrological calculations.
 * It uses the astronomia library for more accurate astronomical calculations.
 */

// Import helper functions from astroHelpers
import { 
  localToUTC,
  cityCoordinates,
  calculateAscendantTrue,
  planetEclipticLongitude,
  applyAyanamsa,
  signsAndDegreesFromLongitude,
  isRetrograde,
  dateToJulianDayUTC,
  lahiriAyanamsa
} from './astroHelpers';

// Import planetary data for VSOP87 calculations
import vsop87Bmercury from 'astronomia/data/vsop87Bmercury';
import vsop87Bvenus from 'astronomia/data/vsop87Bvenus';
import vsop87Bmars from 'astronomia/data/vsop87Bmars';
import vsop87Bjupiter from 'astronomia/data/vsop87Bjupiter';
import vsop87Bsaturn from 'astronomia/data/vsop87Bsaturn';

// Import the planetposition functionality directly
import { planetposition, moonposition } from 'astronomia';
import vsop87Bearth from 'astronomia/data/vsop87Bearth';

// Zodiac signs with date ranges for more accurate calculations
export const zodiacSigns = [
  { id: 1, name: 'Aries', element: 'Fire', quality: 'Cardinal', ruling_planet: 'Mars', start: [3, 21], end: [4, 19] },
  { id: 2, name: 'Taurus', element: 'Earth', quality: 'Fixed', ruling_planet: 'Venus', start: [4, 20], end: [5, 20] },
  { id: 3, name: 'Gemini', element: 'Air', quality: 'Mutable', ruling_planet: 'Mercury', start: [5, 21], end: [6, 20] },
  { id: 4, name: 'Cancer', element: 'Water', quality: 'Cardinal', ruling_planet: 'Moon', start: [6, 21], end: [7, 22] },
  { id: 5, name: 'Leo', element: 'Fire', quality: 'Fixed', ruling_planet: 'Sun', start: [7, 23], end: [8, 22] },
  { id: 6, name: 'Virgo', element: 'Earth', quality: 'Mutable', ruling_planet: 'Mercury', start: [8, 23], end: [9, 22] },
  { id: 7, name: 'Libra', element: 'Air', quality: 'Cardinal', ruling_planet: 'Venus', start: [9, 23], end: [10, 22] },
  { id: 8, name: 'Scorpio', element: 'Water', quality: 'Fixed', ruling_planet: 'Mars/Pluto', start: [10, 23], end: [11, 21] },
  { id: 9, name: 'Sagittarius', element: 'Fire', quality: 'Mutable', ruling_planet: 'Jupiter', start: [11, 22], end: [12, 21] },
  { id: 10, name: 'Capricorn', element: 'Earth', quality: 'Cardinal', ruling_planet: 'Saturn', start: [12, 22], end: [1, 19] },
  { id: 11, name: 'Aquarius', element: 'Air', quality: 'Fixed', ruling_planet: 'Saturn/Uranus', start: [1, 20], end: [2, 18] },
  { id: 12, name: 'Pisces', element: 'Water', quality: 'Mutable', ruling_planet: 'Jupiter/Neptune', start: [2, 19], end: [3, 20] }
];

// Planets data for birth chart
const planets = [
  { 
    id: 1, 
    name: 'Sun', 
    glyph: '☉',
    significations: 'Soul, ego, vitality, self-expression, father',
    descriptions: {
      Aries: 'Bold, confident, and pioneering with a strong drive for self-expression.',
      Taurus: 'Steady, reliable, and appreciative of beauty with a strong sense of values.',
      Gemini: 'Versatile, curious, and communicative with a desire to learn and share ideas.',
      Cancer: 'Nurturing, protective, and emotionally sensitive with strong intuition.',
      Leo: 'Dignified, generous, and creative with natural leadership abilities.',
      Virgo: 'Analytical, precise, and service-oriented with attention to detail.',
      Libra: 'Diplomatic, fair-minded, and socially oriented with a love for harmony.',
      Scorpio: 'Intense, passionate, and transformative with deep emotional power.',
      Sagittarius: 'Optimistic, adventurous, and philosophical with a love for freedom.',
      Capricorn: 'Ambitious, disciplined, and responsible with a drive for achievement.',
      Aquarius: 'Original, independent, and humanitarian with innovative thinking.',
      Pisces: 'Compassionate, intuitive, and dreamy with spiritual inclinations.'
    }
  },
  { 
    id: 2, 
    name: 'Moon', 
    glyph: '☽',
    significations: 'Emotions, instincts, mother, the past, habits',
    descriptions: {
      Aries: 'Emotionally impulsive, courageous, and direct with a need for independence.',
      Taurus: 'Emotionally stable, comfort-seeking, and sensual with a need for security.',
      Gemini: 'Emotionally adaptable, intellectually curious, and communicative with changing moods.',
      Cancer: 'Deeply emotional, nurturing, and protective with strong family bonds.',
      Leo: 'Emotionally warm, proud, and dramatic with a need for recognition.',
      Virgo: 'Emotionally cautious, analytical, and service-oriented with attention to detail.',
      Libra: 'Emotionally balanced, relationship-focused, and harmony-seeking.',
      Scorpio: 'Emotionally intense, secretive, and transformative with powerful feelings.',
      Sagittarius: 'Emotionally optimistic, freedom-loving, and adventurous with enthusiasm.',
      Capricorn: 'Emotionally reserved, responsible, and achievement-oriented with self-control.',
      Aquarius: 'Emotionally detached, friendship-oriented, and humanitarian with originality.',
      Pisces: 'Emotionally sensitive, compassionate, and intuitive with a dreamy nature.'
    }
  },
  { 
    id: 3, 
    name: 'Mercury', 
    glyph: '☿',
    significations: 'Mind, communication, learning, siblings'
  },
  { 
    id: 4, 
    name: 'Venus', 
    glyph: '♀',
    significations: 'Love, beauty, values, relationships'
  },
  { 
    id: 5, 
    name: 'Mars', 
    glyph: '♂',
    significations: 'Energy, action, desire, courage'
  },
  { 
    id: 6, 
    name: 'Jupiter', 
    glyph: '♃',
    significations: 'Expansion, wisdom, growth, philosophy'
  },
  { 
    id: 7, 
    name: 'Saturn', 
    glyph: '♄',
    significations: 'Discipline, responsibility, limitation, structure'
  },
  { 
    id: 8, 
    name: 'Rahu', 
    glyph: '☊',
    significations: 'Worldly desires, obsession, innovation'
  },
  { 
    id: 9, 
    name: 'Ketu', 
    glyph: '☋',
    significations: 'Spirituality, detachment, past life karma'
  }
];

// House descriptions
const houseDescriptions = [
  { number: 1, name: 'First House', significations: 'Self, personality, physical body, appearance' },
  { number: 2, name: 'Second House', significations: 'Wealth, possessions, values, speech' },
  { number: 3, name: 'Third House', significations: 'Communication, siblings, short journeys, courage' },
  { number: 4, name: 'Fourth House', significations: 'Home, mother, emotions, comfort, roots' },
  { number: 5, name: 'Fifth House', significations: 'Creativity, children, romance, pleasure' },
  { number: 6, name: 'Sixth House', significations: 'Health, service, daily work, obstacles' },
  { number: 7, name: 'Seventh House', significations: 'Partnership, marriage, contracts, open enemies' },
  { number: 8, name: 'Eighth House', significations: 'Transformation, shared resources, death, occult' },
  { number: 9, name: 'Ninth House', significations: 'Higher learning, philosophy, travel, beliefs' },
  { number: 10, name: 'Tenth House', significations: 'Career, public image, authority, father' },
  { number: 11, name: 'Eleventh House', significations: 'Friends, groups, hopes, gains' },
  { number: 12, name: 'Twelfth House', significations: 'Spirituality, isolation, hidden matters, loss' }
];

// Planetary orbital periods in days (more accurate values)
const PLANETARY_PERIODS = {
  'Sun': 365.25,
  'Moon': 27.32,
  'Mercury': 87.97,
  'Venus': 224.7,
  'Mars': 686.98,
  'Jupiter': 4332.59,
  'Saturn': 10759.22,
  'Rahu': 6793.48,  // Lunar North Node
  'Ketu': 6793.48   // Lunar South Node (same as Rahu but opposite)
};

// Reference dates for planetary starting positions (approximate)
const REFERENCE_DATE = new Date('2000-01-01T12:00:00Z');
const REFERENCE_POSITIONS = {
  'Sun': 279.85,      // Capricorn
  'Moon': 228.53,     // Scorpio
  'Mercury': 287.46,  // Capricorn
  'Venus': 286.34,    // Capricorn
  'Mars': 260.35,     // Sagittarius
  'Jupiter': 34.33,   // Taurus
  'Saturn': 50.4,     // Taurus
  'Rahu': 159.9,      // Virgo
  'Ketu': 339.9       // Pisces
};

// Define planetary longitude calculation functions
function tropicalSunLongitude(jsDate) {
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

function tropicalMoonLongitude(jsDate) {
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

function calculateLunarNodeLongitude(date) {
  console.log('=== LUNAR NODE CALCULATION ===');
  console.log('Input date:', date.toISOString());
  const jd = dateToJulianDayUTC(date);
  
  // Approximate Rahu position (lunar ascending node)
  // This is a simplified calculation and should be replaced with proper ephemeris
  const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000
  
  // Mean longitude of the ascending node
  let omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000;
  
  // Normalize to 0-360
  omega = (omega % 360 + 360) % 360;
  
  console.log('Lunar node calculation:', {
    julianDay: jd,
    centuries: T,
    longitude: omega.toFixed(2)
  });
  
  return omega;
}

// Define more simplified planet calculations to avoid library dependency issues
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

/**
 * Generate a birth chart based on the provided birth data
 * @param {Object} birthData - Contains name, birthDate, birthTime, birthPlace
 * @param {String} system - 'vedic' or 'western' (default: 'vedic')
 * @returns {Promise} - Resolves to a birth chart object
 */
export const generateBirthChart = async (birthData, system = 'vedic') => {
  try {
    // Force immediate console output
    console.log('=== BIRTH CHART GENERATION START ===');
    console.log('Input Data:', JSON.stringify(birthData, null, 2));
    console.log('Astrological System:', system);
    
    const isVedic = system === 'vedic'; // Flag to determine calculation method
    
    // Validate input data
    if (!birthData.name) {
      console.error('Name is missing');
      throw new Error('Please provide your name');
    }
    
    if (!birthData.birthDate) {
      console.error('Birth date is missing');
      throw new Error('Birth date is required');
    }
    
    if (!birthData.birthPlace) {
      console.error('Birth place is missing');
      throw new Error('Birth place is required');
    }
    
    // For accurate ascendant calculation, birth time is essential
    if (!birthData.birthTime) {
      console.warn('WARNING: Birth time not provided. Ascendant and house positions may be less accurate.');
    }
    
    // Convert local birth time to UTC
    console.log('Converting birth time to UTC...');
    console.log('Input:', {
      date: birthData.birthDate,
      time: birthData.birthTime || "12:00",
      place: birthData.birthPlace
    });
    
    const jsDateUTC = localToUTC(birthData.birthDate, birthData.birthTime || "12:00", birthData.birthPlace);
    console.log('UTC Date:', jsDateUTC.toISOString());
    
    // Get coordinates for birth place
    console.log('Looking up coordinates for:', birthData.birthPlace);
    // Make lookup case-insensitive
    const cityLowerCase = birthData.birthPlace.toLowerCase();
    let coords = null;
    for (const city in cityCoordinates) {
      if (city.toLowerCase() === cityLowerCase) {
        coords = cityCoordinates[city];
        break;
      }
    }
    let coordsToUse;
    
    if (!coords) {
      console.log('Coordinates not found directly for:', birthData.birthPlace);
      
      // Try to find coordinates for any partial match
      let foundCoords = null;
      const userCity = birthData.birthPlace.toLowerCase();
      
      // Check if the entered city name is contained in any of our known cities
      for (const city in cityCoordinates) {
        if (city.toLowerCase().includes(userCity) || userCity.includes(city.toLowerCase())) {
          console.log(`Found partial match for coordinates: ${city}`);
          foundCoords = cityCoordinates[city];
          break;
        }
      }
      
      // If still not found, default to a reasonable location in India (for now)
      // In a production app, you would use a geocoding API here
      if (!foundCoords) {
        console.log('Using default coordinates (Delhi, India) as fallback');
        foundCoords = { lat: 28.6139, lon: 77.209 }; // Delhi coordinates as fallback
      }
      
      // Use the fallback coordinates
      coordsToUse = foundCoords;
      console.log('Using fallback coordinates:', coordsToUse);
    } else {
      coordsToUse = coords;
      console.log('Coordinates found:', coordsToUse);
    }
    
    // Calculate tropical Ascendant first
    console.log('Calculating ascendant with coordinates:', {
      date: jsDateUTC.toISOString(),
      lat: coordsToUse.lat,
      lon: coordsToUse.lon
    });
    
    const ascObj = calculateAscendantTrue(jsDateUTC, coordsToUse.lat, coordsToUse.lon, isVedic);
    console.log('Ascendant calculated:', ascObj);
    
    // For Western astrology, we use the tropical ascendant directly
    // For Vedic, we've already applied ayanamsa in calculateAscendantTrue
    
    // Get the ascendant sign index
    const ascendantSignIndex = zodiacSigns.findIndex(sign => sign.name === ascObj.sign);
    console.log('Ascendant sign index:', ascendantSignIndex);
    
    // Calculate planetary positions
    console.log('\n=== CALCULATING PLANETARY POSITIONS ===');
    const planetaryPositions = planets.map(planet => {
      console.log(`\n--- ${planet.name} ---`);
      let tropicalLon;
      
      // Get tropical longitude based on planet
      switch(planet.name) {
        case 'Sun':
          tropicalLon = tropicalSunLongitude(jsDateUTC);
          break;
        case 'Moon':
          tropicalLon = tropicalMoonLongitude(jsDateUTC);
          break;
        case 'Mercury':
          tropicalLon = tropicalMercuryLongitude(jsDateUTC);
          break;
        case 'Venus':
          tropicalLon = tropicalVenusLongitude(jsDateUTC);
          break;
        case 'Mars':
          tropicalLon = tropicalMarsLongitude(jsDateUTC);
          break;
        case 'Jupiter':
          tropicalLon = tropicalJupiterLongitude(jsDateUTC);
          break;
        case 'Saturn':
          tropicalLon = tropicalSaturnLongitude(jsDateUTC);
          break;
        case 'Rahu':
          const jd = dateToJulianDayUTC(jsDateUTC);
          const T = (jd - 2451545.0)/36525;
          tropicalLon = 125.04452 - 1934.136261*T + 0.0020708*T*T + (T*T*T)/450000;
          tropicalLon = (tropicalLon % 360 + 360) % 360;
          break;
        case 'Ketu':
          const rahuLon = calculateLunarNodeLongitude(jsDateUTC);
          tropicalLon = (rahuLon + 180) % 360;
          break;
        default:
          console.warn(`No calculation method for ${planet.name}, defaulting to 0`);
          tropicalLon = 0;
      }
      
      console.log(`${planet.name} tropical longitude: ${tropicalLon.toFixed(2)}°`);
      
      // For Vedic system, convert to sidereal (Lahiri)
      // For Western system, use tropical directly
      const longitude = isVedic ? applyAyanamsa(tropicalLon, jsDateUTC) : tropicalLon;
      console.log(`${planet.name} ${isVedic ? 'sidereal' : 'tropical'} longitude: ${longitude.toFixed(2)}°`);
      
      const position = signsAndDegreesFromLongitude(longitude);
      console.log(`${planet.name} position: ${position.sign} ${position.degree}°`);
      
      // Find sign index
      const signIndex = zodiacSigns.findIndex(sign => sign.name === position.sign);
      
      // Calculate house placement based on ascendant
      const houseIndex = (signIndex + 12 - ascendantSignIndex) % 12;
      console.log(`${planet.name} house placement: ${houseIndex + 1}`);
      
      // Check if planet is retrograde
      const retrograde = isRetrograde(planet.name, jsDateUTC, isVedic);
      console.log(`${planet.name} retrograde status: ${retrograde}`);
      
      const planetData = {
        ...planet,
        sign: position.sign,
        house: houseIndex + 1,
        degree: position.degree,
        retrograde: retrograde
      };
      
      console.log(`${planet.name} final data:`, planetData);
      return planetData;
    });
    
    // Create house data
    console.log('\n=== CREATING HOUSE DATA ===');
    const houses = Array.from({ length: 12 }, (_, i) => {
      const houseNum = i + 1;
      const signIndex = (ascendantSignIndex + i) % 12;
      
      // Calculate house cusps
      let cuspDegree;
      if (i === 0) {
        cuspDegree = ascObj.degree;
      } else {
        cuspDegree = (ascObj.degree + i * 30) % 30;
      }
      
      const houseData = {
        ...houseDescriptions[i],
        number: houseNum,
        sign: zodiacSigns[signIndex].name,
        cusp: cuspDegree,
        significations: houseDescriptions[i].significations
      };
      
      console.log(`House ${houseNum}:`, houseData);
      return houseData;
    });
    
    // Get moon sign data
    console.log('\n=== CALCULATING MOON SIGN DATA ===');
    const moonPlanet = planetaryPositions.find(p => p.name === 'Moon');
    if (!moonPlanet) {
      console.error('Moon planet data not found!');
      throw new Error("Moon planet data not found");
    }
    
    const moonSignData = {
      sign: moonPlanet.sign,
      description: planets[1].descriptions[moonPlanet.sign] || 
                  'Your Moon sign reveals your emotional nature and unconscious patterns.',
      nakshatra: calculateNakshatra(moonPlanet.sign, moonPlanet.degree)
    };
    console.log('Moon sign data:', moonSignData);
    
    // Get sun sign data
    console.log('\n=== CALCULATING SUN SIGN DATA ===');
    const sunPlanet = planetaryPositions.find(p => p.name === 'Sun');
    if (!sunPlanet) {
      console.error('Sun planet data not found!');
      throw new Error("Sun planet data not found");
    }
    
    const sunSignData = {
      sign: sunPlanet.sign,
      description: planets[0].descriptions[sunPlanet.sign] || 
                  'Your Sun sign represents your core essence and conscious personality.'
    };
    console.log('Sun sign data:', sunSignData);
    
    // Calculate yogas
    console.log('\n=== CALCULATING YOGAS ===');
    const yogas = calculateYogas(planetaryPositions, ascObj.sign);
    console.log('Yogas found:', yogas);
    
    // Create final chart
    const chart = {
      name: birthData.name,
      birthDate: birthData.birthDate,
      birthTime: birthData.birthTime || 'Unknown',
      birthPlace: birthData.birthPlace,
      system: isVedic ? 'Vedic (Sidereal)' : 'Western (Tropical)',
      ascendant: {
        sign: ascObj.sign,
        degree: ascObj.degree,
        description: getAscendantDescription(ascObj.sign)
      },
      sunSign: sunSignData,
      moonSign: moonSignData,
      planetaryPositions,
      houses,
      aspects: generateRealisticAspects(planetaryPositions),
      yogas: yogas,
      doshas: calculateDoshas(planetaryPositions, houses),
      strengths: calculatePlanetaryStrengths(planetaryPositions)
    };
    
    console.log('\n=== BIRTH CHART GENERATION COMPLETE ===');
    console.log('Final chart:', JSON.stringify(chart, null, 2));
    
    return chart;
    
  } catch (error) {
    console.error('ERROR IN BIRTH CHART GENERATION:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to generate birth chart: ${error.message}`);
  }
};

/**
 * Get the day of the year (1-366)
 * @param {Date} date - The date to calculate day of year for
 * @returns {Number} - The day of the year
 */
const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

/**
 * Calculate nakshatra (lunar mansion) based on sign and degree
 * @param {String} sign - Zodiac sign
 * @param {Number} degree - Degree in sign
 * @returns {Object} - Nakshatra information
 */
const calculateNakshatra = (sign, degree) => {
  try {
    // There are 27 nakshatras distributed across the 12 signs
    // Each nakshatra spans 13°20' (13.33 degrees)
    
    const nakshatras = [
      { name: 'Ashwini', ruler: 'Ketu', deity: 'Ashwini Kumaras' },
      { name: 'Bharani', ruler: 'Venus', deity: 'Yama' },
      { name: 'Krittika', ruler: 'Sun', deity: 'Agni' },
      { name: 'Rohini', ruler: 'Moon', deity: 'Brahma' },
      { name: 'Mrigashira', ruler: 'Mars', deity: 'Soma' },
      { name: 'Ardra', ruler: 'Rahu', deity: 'Rudra' },
      { name: 'Punarvasu', ruler: 'Jupiter', deity: 'Aditi' },
      { name: 'Pushya', ruler: 'Saturn', deity: 'Brihaspati' },
      { name: 'Ashlesha', ruler: 'Mercury', deity: 'Nagas' },
      { name: 'Magha', ruler: 'Ketu', deity: 'Pitris' },
      { name: 'Purva Phalguni', ruler: 'Venus', deity: 'Bhaga' },
      { name: 'Uttara Phalguni', ruler: 'Sun', deity: 'Aryaman' },
      { name: 'Hasta', ruler: 'Moon', deity: 'Savitar' },
      { name: 'Chitra', ruler: 'Mars', deity: 'Vishwakarma' },
      { name: 'Swati', ruler: 'Rahu', deity: 'Vayu' },
      { name: 'Vishakha', ruler: 'Jupiter', deity: 'Indra and Agni' },
      { name: 'Anuradha', ruler: 'Saturn', deity: 'Mitra' },
      { name: 'Jyeshtha', ruler: 'Mercury', deity: 'Indra' },
      { name: 'Mula', ruler: 'Ketu', deity: 'Nirrti' },
      { name: 'Purva Ashadha', ruler: 'Venus', deity: 'Apah' },
      { name: 'Uttara Ashadha', ruler: 'Sun', deity: 'Vishvadevas' },
      { name: 'Shravana', ruler: 'Moon', deity: 'Vishnu' },
      { name: 'Dhanishta', ruler: 'Mars', deity: 'Vasus' },
      { name: 'Shatabhisha', ruler: 'Rahu', deity: 'Varuna' },
      { name: 'Purva Bhadrapada', ruler: 'Jupiter', deity: 'Ajaikapada' },
      { name: 'Uttara Bhadrapada', ruler: 'Saturn', deity: 'Ahir Budhnya' },
      { name: 'Revati', ruler: 'Mercury', deity: 'Pushan' }
    ];
    
    // Calculate absolute position in zodiac (0-360 degrees)
    const signIndex = zodiacSigns.findIndex(s => s.name === sign);
    
    // Handle edge case where sign is not found
    if (signIndex === -1) {
      return {
        name: "Unknown",
        ruler: "Unknown",
        deity: "Unknown",
        pada: 1
      };
    }
    
    const absoluteDegree = (signIndex * 30) + degree;
    
    // Calculate nakshatra index (0-26)
    const nakshatraIndex = Math.floor(absoluteDegree / (360/27)) % 27;
    
    // Calculate pada (quarter) within nakshatra (1-4)
    const degreeInNakshatra = absoluteDegree % (360/27);
    const pada = Math.floor(degreeInNakshatra / ((360/27)/4)) + 1;
    
    return {
      ...nakshatras[nakshatraIndex],
      pada: pada
    };
  } catch (error) {
    console.error("Error calculating nakshatra:", error);
    // Return a fallback object to prevent app crashing
    return {
      name: "Not Available",
      ruler: "Unknown",
      deity: "Unknown",
      pada: 1
    };
  }
};

/**
 * Generate more realistic planetary aspects
 * @param {Array} planets - Array of planet objects with positions
 * @returns {Array} - Array of aspect objects
 */
const generateRealisticAspects = (planets) => {
  const aspects = [];
  const aspectTypes = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Square', angle: 90, orb: 7 },
    { name: 'Sextile', angle: 60, orb: 6 }
  ];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      // Calculate absolute positions of planets
      const planet1Position = zodiacSigns.findIndex(s => s.name === planet1.sign) * 30 + planet1.degree;
      const planet2Position = zodiacSigns.findIndex(s => s.name === planet2.sign) * 30 + planet2.degree;
      
      // Calculate the angular distance between planets
      let angularDistance = Math.abs(planet1Position - planet2Position);
      if (angularDistance > 180) angularDistance = 360 - angularDistance;
      
      // Check if the planets form any aspect
      for (const aspectType of aspectTypes) {
        const diff = Math.abs(angularDistance - aspectType.angle);
        if (diff <= aspectType.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: aspectType.name,
            orb: diff.toFixed(1),
            influence: getAspectInfluence(planet1.name, planet2.name, aspectType.name)
          });
          break; // Each planet pair can only form one type of aspect
        }
      }
    }
  }
  
  return aspects;
};

/**
 * Get the influence description for an aspect between two planets
 * @param {String} planet1 - First planet name
 * @param {String} planet2 - Second planet name
 * @param {String} aspectType - Type of aspect
 * @returns {String} - Description of the aspect's influence
 */
const getAspectInfluence = (planet1, planet2, aspectType) => {
  const aspectInfluences = {
    'Sun-Moon': {
      'Conjunction': 'Strong sense of purpose aligned with emotions',
      'Opposition': 'Internal conflict between will and emotions',
      'Trine': 'Harmony between conscious and unconscious mind',
      'Square': 'Tension between identity and emotional needs',
      'Sextile': 'Opportunity for self-awareness and emotional growth'
    },
    'Sun-Mercury': {
      'Conjunction': 'Clear thinking and effective communication',
      'Opposition': 'Intellectual perspective differs from core identity',
      'Trine': 'Harmonious flow between thoughts and self-expression',
      'Square': 'Mental stress and challenges in self-expression',
      'Sextile': 'Intellectual opportunities and mental clarity'
    },
    'Moon-Venus': {
      'Conjunction': 'Strong emotional connection to relationships and art',
      'Opposition': 'Conflict between emotional needs and relating to others',
      'Trine': 'Natural emotional expression through beauty and harmony',
      'Square': 'Tension between feelings and desires',
      'Sextile': 'Opportunity for emotional fulfillment through relationships'
    }
    // Add more combinations as needed
  };
  
  // Create a standardized key by alphabetically sorting planet names
  const planets = [planet1, planet2].sort();
  const aspectKey = `${planets[0]}-${planets[1]}`;
  
  // Return specific description if available
  if (aspectInfluences[aspectKey] && aspectInfluences[aspectKey][aspectType]) {
    return aspectInfluences[aspectKey][aspectType];
  }
  
  // Return generic descriptions if specific one not found
  const genericDescriptions = {
    'Conjunction': 'These planets combine their energies, intensifying both their positive and challenging qualities',
    'Opposition': 'These planets create tension and awareness through their polarized energies',
    'Trine': 'These planets work together harmoniously, creating ease and flow',
    'Square': 'These planets create dynamic tension that motivates action and growth',
    'Sextile': 'These planets create opportunities for growth through gentle cooperation'
  };
  
  return genericDescriptions[aspectType] || 'These planets influence each other significantly in your chart';
};

/**
 * Calculate important yogas (planetary combinations) in the chart
 * @param {Array} planets - Array of planet objects with positions
 * @param {String} ascendantSign - The rising sign
 * @returns {Array} - Array of yoga objects
 */
const calculateYogas = (planets, ascendantSign) => {
  const yogas = [];
  
  // Check for Gaja Kesari Yoga (Moon and Jupiter in angles)
  const moon = planets.find(p => p.name === 'Moon');
  const jupiter = planets.find(p => p.name === 'Jupiter');
  
  if (moon && jupiter) {
    const angularHouses = [1, 4, 7, 10]; // Kendra houses
    if (angularHouses.includes(moon.house) && angularHouses.includes(jupiter.house)) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        description: 'Indicates success, fame, and prosperity. You may possess leadership qualities and gain recognition in your field.',
        strength: 'Strong'
      });
    }
  }
  
  // Check for Budha-Aditya Yoga (Sun and Mercury conjunction)
  const sun = planets.find(p => p.name === 'Sun');
  const mercury = planets.find(p => p.name === 'Mercury');
  
  if (sun && mercury && sun.sign === mercury.sign && Math.abs(sun.degree - mercury.degree) < 10) {
    yogas.push({
      name: 'Budha-Aditya Yoga',
      description: 'Indicates intelligence, communication skills, and success in education or intellectual pursuits.',
      strength: 'Moderate'
    });
  }
  
  // Check for Chandra-Mangala Yoga (Moon and Mars conjunction)
  const mars = planets.find(p => p.name === 'Mars');
  
  if (moon && mars && moon.sign === mars.sign && Math.abs(moon.degree - mars.degree) < 10) {
    yogas.push({
      name: 'Chandra-Mangala Yoga',
      description: 'Indicates courage, emotional strength, and ability to overcome obstacles.',
      strength: 'Moderate'
    });
  }
  
  return yogas;
};

/**
 * Calculate doshas (planetary afflictions) in the chart
 * @param {Array} planets - Array of planet objects with positions
 * @param {Array} houses - Array of house objects
 * @returns {Array} - Array of dosha objects
 */
const calculateDoshas = (planets, houses) => {
  const doshas = [];
  
  // Check for Kala Sarpa Dosha (all planets between Rahu and Ketu)
  const rahu = planets.find(p => p.name === 'Rahu');
  const ketu = planets.find(p => p.name === 'Ketu');
  
  if (rahu && ketu) {
    const rahuPos = zodiacSigns.findIndex(s => s.name === rahu.sign) * 30 + rahu.degree;
    const ketuPos = zodiacSigns.findIndex(s => s.name === ketu.sign) * 30 + ketu.degree;
    
    // Check if all planets are between Rahu and Ketu
    let allPlanetsBetween = true;
    planets.forEach(planet => {
      if (planet.name !== 'Rahu' && planet.name !== 'Ketu') {
        const planetPos = zodiacSigns.findIndex(s => s.name === planet.sign) * 30 + planet.degree;
        
        // Check if planet is outside the Rahu-Ketu axis
        if (rahuPos < ketuPos) {
          if (planetPos < rahuPos || planetPos > ketuPos) {
            allPlanetsBetween = false;
          }
        } else {
          if (planetPos > rahuPos || planetPos < ketuPos) {
            allPlanetsBetween = false;
          }
        }
      }
    });
    
    if (allPlanetsBetween) {
      doshas.push({
        name: 'Kala Sarpa Dosha',
        description: 'Indicates potential obstacles and delays in life progress. Remedial measures may be beneficial.',
        severity: 'Moderate',
        remedies: 'Worship of Lord Shiva, donation on eclipses, and specific mantras can help mitigate effects.'
      });
    }
  }
  
  // Check for Mangal Dosha (Mars in 1st, 4th, 7th, 8th, or 12th house)
  const mars = planets.find(p => p.name === 'Mars');
  if (mars && [1, 4, 7, 8, 12].includes(mars.house)) {
    doshas.push({
      name: 'Mangal Dosha (Kuja Dosha)',
      description: 'May affect marital harmony and partnerships. The strength depends on other planetary positions.',
      severity: mars.house === 7 ? 'Strong' : 'Moderate',
      remedies: 'Worship of Lord Hanuman or Karthikeya, wearing red coral after proper consultation.'
    });
  }
  
  return doshas;
};

/**
 * Calculate planetary strengths in the chart
 * @param {Array} planets - Array of planet objects with positions
 * @returns {Array} - Array of planetary strength objects
 */
const calculatePlanetaryStrengths = (planets) => {
  const strengths = [];
  
  // Exaltation and debilitation signs for planets
  const planetaryStrengths = {
    'Sun': { exaltation: 'Aries', debilitation: 'Libra', friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Saturn', 'Venus'] },
    'Moon': { exaltation: 'Taurus', debilitation: 'Scorpio', friends: ['Sun', 'Mercury'], enemies: ['Saturn'] },
    'Mercury': { exaltation: 'Virgo', debilitation: 'Pisces', friends: ['Sun', 'Venus'], enemies: ['Moon'] },
    'Venus': { exaltation: 'Pisces', debilitation: 'Virgo', friends: ['Saturn', 'Mercury'], enemies: ['Sun', 'Moon'] },
    'Mars': { exaltation: 'Capricorn', debilitation: 'Cancer', friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'] },
    'Jupiter': { exaltation: 'Cancer', debilitation: 'Capricorn', friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
    'Saturn': { exaltation: 'Libra', debilitation: 'Aries', friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] },
    'Rahu': { exaltation: 'Taurus', debilitation: 'Scorpio', friends: ['Saturn', 'Venus'], enemies: ['Sun', 'Moon'] },
    'Ketu': { exaltation: 'Scorpio', debilitation: 'Taurus', friends: ['Mars', 'Saturn'], enemies: ['Sun', 'Moon', 'Venus'] }
  };
  
  planets.forEach(planet => {
    if (planetaryStrengths[planet.name]) {
      const planetInfo = planetaryStrengths[planet.name];
      let strength = 'Moderate';
      let notes = [];
      
      // Check for exaltation/debilitation
      if (planet.sign === planetInfo.exaltation) {
        strength = 'Exalted';
        notes.push(`${planet.name} is exalted in ${planet.sign}, increasing its positive influence.`);
      } else if (planet.sign === planetInfo.debilitation) {
        strength = 'Debilitated';
        notes.push(`${planet.name} is debilitated in ${planet.sign}, potentially weakening its expression.`);
      }
      
      // Check for planetary friends and enemies in same sign
      const friendsInSameSign = planets.filter(p => 
        planetInfo.friends.includes(p.name) && p.sign === planet.sign
      );
      
      const enemiesInSameSign = planets.filter(p => 
        planetInfo.enemies.includes(p.name) && p.sign === planet.sign
      );
      
      if (friendsInSameSign.length > 0) {
        notes.push(`${planet.name} is with friendly planets (${friendsInSameSign.map(p => p.name).join(', ')}), strengthening its effects.`);
        if (strength !== 'Exalted') strength = 'Strong';
      }
      
      if (enemiesInSameSign.length > 0) {
        notes.push(`${planet.name} is with unfriendly planets (${enemiesInSameSign.map(p => p.name).join(', ')}), potentially creating challenges.`);
        if (strength !== 'Debilitated') strength = 'Challenged';
      }
      
      // Check for retrograde motion
      if (planet.retrograde) {
        notes.push(`${planet.name} is retrograde, turning its energy inward or toward past matters.`);
      }
      
      strengths.push({
        planet: planet.name,
        sign: planet.sign,
        house: planet.house,
        strength: strength,
        notes: notes
      });
    }
  });
  
  return strengths;
};

/**
 * Get a description for an ascendant sign
 * @param {String} sign - The zodiac sign
 * @returns {String} - A description of the ascendant sign
 */
const getAscendantDescription = (sign) => {
  const descriptions = {
    'Aries': 'You project a confident, energetic, and pioneering personality. You may appear bold, direct, and ready for action. Your physical demeanor is often athletic and your approach to life is straightforward and enthusiastic.',
    'Taurus': 'You project a steady, reliable, and sensual personality. You may appear patient, determined, and appreciative of beauty and comfort. Your physical demeanor is often solid and grounded with a methodical approach to life.',
    'Gemini': 'You project a quick-witted, versatile, and communicative personality. You may appear youthful, curious, and intellectually engaging. Your physical demeanor is often animated and your approach to life is adaptable and inquisitive.',
    'Cancer': 'You project a nurturing, protective, and emotionally responsive personality. You may appear sensitive, empathetic, and family-oriented. Your physical demeanor is often receptive and your approach to life is caring and intuitive.',
    'Leo': 'You project a confident, dramatic, and warm-hearted personality. You may appear dignified, generous, and creative. Your physical demeanor is often proud and your approach to life is expressive and enthusiastic.',
    'Virgo': 'You project a practical, analytical, and detail-oriented personality. You may appear modest, helpful, and health-conscious. Your physical demeanor is often neat and your approach to life is methodical and service-oriented.',
    'Libra': 'You project a diplomatic, charming, and socially graceful personality. You may appear refined, fair-minded, and partnership-oriented. Your physical demeanor is often balanced and your approach to life is harmonious.',
    'Scorpio': 'You project an intense, mysterious, and powerful personality. You may appear reserved, perceptive, and somewhat secretive. Your physical demeanor is often magnetic and your approach to life is transformative.',
    'Sagittarius': 'You project an optimistic, adventurous, and philosophical personality. You may appear enthusiastic, straightforward, and freedom-loving. Your physical demeanor is often active and your approach to life is expansive.',
    'Capricorn': 'You project an ambitious, disciplined, and responsible personality. You may appear serious, practical, and goal-oriented. Your physical demeanor is often dignified and your approach to life is structured and patient.',
    'Aquarius': 'You project an original, humanitarian, and independent personality. You may appear friendly, progressive, and somewhat detached. Your physical demeanor is often unique and your approach to life is innovative.',
    'Pisces': 'You project a compassionate, intuitive, and dreamy personality. You may appear gentle, imaginative, and spiritually oriented. Your physical demeanor is often fluid and your approach to life is adaptable and empathetic.'
  };
  
  return descriptions[sign] || 'Your Ascendant sign shapes how others perceive you and your approach to the world.';
};

/**
 * Get tropical sun sign based on birth date
 * @param {Date} date - Birth date
 * @returns {String} - Zodiac sign name
 */
const getTropicalSunSign = (date) => {
  const month = date.getMonth() + 1; // 1-12 (Jan = 1)
  const day = date.getDate();
  
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    
    // Handle special case for Capricorn (crosses year boundary)
    if (startMonth > endMonth) {
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay) ||
          (month > startMonth) || 
          (month < endMonth)) {
        return sign.name;
      }
    } else {
      // Normal case within same year
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay) ||
          (month > startMonth && month < endMonth)) {
        return sign.name;
      }
    }
  }
  
  // Fallback (shouldn't reach here)
  return 'Aries';
};

/**
 * Calculate planetary position more accurately
 * @param {String} planetName - Name of the planet
 * @param {Date} birthDate - Birth date
 * @returns {Object} - Position object with sign and degree
 */
const calculatePlanetaryPosition = (planetName, birthDate) => {
  try {
    const period = PLANETARY_PERIODS[planetName];
    if (!period) {
      console.warn(`No period defined for planet: ${planetName}`);
      return { sign: 'Aries', degree: 0 };
    }
    
    // Calculate days since reference date
    const timeDiff = birthDate.getTime() - REFERENCE_DATE.getTime();
    const daysSince = timeDiff / (1000 * 60 * 60 * 24);
    
    // Calculate position in degrees (0-360)
    const dailyMotion = 360 / period;
    const movement = daysSince * dailyMotion;
    const startPosition = REFERENCE_POSITIONS[planetName] || 0;
    
    // Final position with reference position offset
    let position = (startPosition + movement) % 360;
    if (position < 0) position += 360;
    
    // Convert to sign and degree
    const signIndex = Math.floor(position / 30);
    const degree = position % 30;
    
    return {
      sign: zodiacSigns[signIndex].name,
      degree: parseFloat(degree.toFixed(2))
    };
  } catch (error) {
    console.error(`Error calculating position for ${planetName}:`, error);
    return { sign: 'Aries', degree: 0 };
  }
};

/**
 * Calculate ascendant sign more accurately
 * @param {Date} birthDate - Birth date
 * @param {String} birthTime - Birth time (HH:MM format)
 * @returns {Number} - Index of the ascendant sign
 */
const calculateAscendant = (birthDate, birthTime) => {
  if (!birthTime) {
    // Fallback if no birth time provided
    return (birthDate.getMonth() + Math.floor(birthDate.getDate() / 3)) % 12;
  }
  
  try {
    const [hours, minutes] = birthTime.split(':').map(Number);
    const localTime = hours + minutes / 60; // Time in decimal hours
    
    // Calculate local sidereal time (simplified)
    // Each sign rises for approximately 2 hours
    const signDuration = 2;
    const timeBasedIndex = Math.floor(localTime / signDuration) % 12;
    
    // Adjust based on day of year (seasonal variation)
    const dayOfYear = getDayOfYear(birthDate);
    const seasonalFactor = Math.floor(dayOfYear / 30.44) % 12; // ~30.44 days per month
    
    return (timeBasedIndex + seasonalFactor) % 12;
  } catch (error) {
    console.error("Error calculating ascendant:", error);
    // Fallback to simple calculation
    return (birthDate.getMonth() + Math.floor(birthDate.getDate() / 3)) % 12;
  }
};

export default {
  generateBirthChart,
  zodiacSigns,
  planets,
  houseDescriptions,
  getTropicalSunSign,
  calculatePlanetaryPosition,
  calculateAscendant
}; 