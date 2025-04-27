// horoscopeData.js - Contains data structure for daily horoscope feature

// Planet data with names, glyphs, and descriptions
export const planets = [
  {
    id: 1,
    name: "Sun",
    glyph: "☉",
    description: "Represents ego, identity, and vitality"
  },
  {
    id: 2,
    name: "Moon",
    glyph: "☾",
    description: "Represents emotions, instincts, and the subconscious"
  },
  {
    id: 3,
    name: "Mars",
    glyph: "♂",
    description: "Represents energy, action, and desire"
  },
  {
    id: 4,
    name: "Mercury",
    glyph: "☿",
    description: "Represents communication, intellect, and perception"
  },
  {
    id: 5,
    name: "Jupiter",
    glyph: "♃",
    description: "Represents growth, expansion, and wisdom"
  },
  {
    id: 6,
    name: "Venus",
    glyph: "♀",
    description: "Represents love, beauty, and harmony"
  },
  {
    id: 7,
    name: "Saturn",
    glyph: "♄",
    description: "Represents discipline, responsibility, and limitation"
  },
  {
    id: 8,
    name: "Rahu",
    glyph: "☊",
    description: "Represents ambition, obsession, and worldly desire"
  },
  {
    id: 9,
    name: "Ketu",
    glyph: "☋",
    description: "Represents spirituality, liberation, and detachment"
  }
];

// Sample initial horoscope data - this would normally be fetched from a backend
export const initialHoroscope = {
  date: new Date().toISOString().split('T')[0],
  lastUpdated: new Date().toISOString(),
  entries: [
    {
      planetId: 1,
      text: "The Sun's energy brings clarity to your path today. Focus on your goals with renewed determination and watch as opportunities unfold before you."
    },
    {
      planetId: 2,
      text: "The Moon illuminates your emotional landscape. Take time to reflect on your feelings and nurture your inner self for greater harmony."
    },
    {
      planetId: 3,
      text: "Mars energizes your spirit. Channel this dynamic power into productive activities while being mindful not to act impulsively."
    },
    {
      planetId: 4,
      text: "Mercury enhances your communication skills today. Express your ideas clearly and you'll find others more receptive to your perspective."
    },
    {
      planetId: 5,
      text: "Jupiter expands your horizons. Embrace opportunities for growth and learning, as knowledge gained today will benefit you in the future."
    },
    {
      planetId: 6,
      text: "Venus brings harmony to your relationships. Open your heart to give and receive love, appreciating the beauty in those around you."
    },
    {
      planetId: 7,
      text: "Saturn calls for discipline and patience. Hard work now will create a solid foundation for future success, so persevere through challenges."
    },
    {
      planetId: 8,
      text: "Rahu intensifies your ambitions. Focus your desires wisely, avoiding obsessive tendencies while pursuing material goals with balance."
    },
    {
      planetId: 9,
      text: "Ketu draws you toward spiritual insight. Listen to your intuition and release attachments that no longer serve your higher purpose."
    }
  ]
};

// Function to get today's horoscope
export const getTodayHoroscope = () => {
  // In a real application, this would fetch from a backend
  // For now, we'll return the sample data
  return initialHoroscope;
};

// Function to save daily horoscope (admin only)
export const saveHoroscope = (horoscopeData) => {
  // In a real application, this would send data to a backend
  console.log("Saving horoscope data:", horoscopeData);
  // For demo purposes, we'll store in localStorage
  localStorage.setItem('currentHoroscope', JSON.stringify(horoscopeData));
  return true;
}; 