// data.js - Contains JSON data for products and puja services
// This file serves as a mock database for our e-commerce application

// Product data for Shop component
export const products = [
    {
      id: 1,
      name: 'Premium Brass Puja Thali Set',
      price: 1200,
      rating: 4.5,
      reviews: 123,
      category: 'puja-items',
      image: '/images/pujaThali.jpg',
      description: 'This premium brass puja thali set includes all essential items for daily worship rituals. The set contains a beautifully crafted brass thali, small bowls for holy water and kumkum, a bell, a diya lamp, and an incense stick holder. Perfect for home temples and regular puja ceremonies.',
      features: [
        'Made from high-quality brass with intricate detailing',
        'Complete set with all essential puja items',
        'Tarnish-resistant finish for long-lasting shine',
        'Dimensions: 10-inch diameter thali with accompanying items'
      ],
      stock: 25,
      discount: 8,
      tags: ['puja thali', 'brass', 'worship items', 'daily puja', 'ritual items']
    },
    {
      id: 2,
      name: 'Lord Ganesha Idol (Gold Plated)',
      price: 2499,
      rating: 4.8,
      reviews: 89,
      category: 'idols',
      image: '/images/ganesh.jpg',
      description: 'This exquisite gold-plated Lord Ganesha idol is meticulously crafted with attention to detail. The divine form of Lord Ganesha, the remover of obstacles, is beautifully represented with traditional iconography. Place it in your home temple or desk for blessings of wisdom and prosperity.',
      features: [
        'Crafted with premium quality metal with gold plating',
        'Detailed traditional design with fine craftsmanship',
        'Height: 8 inches, Weight: 1.2 kg',
        'Comes with a decorative wooden base'
      ],
      stock: 15,
      discount: 5,
      tags: ['ganesh', 'idol', 'god statue', 'gold plated', 'home temple']
    },
    {
      id: 3,
      name: 'Wooden Prayer Stand',
      price: 799,
      rating: 4.0,
      reviews: 45,
      category: 'puja-items',
      image: '/images/pujaThali.jpg',
      description: 'This foldable wooden prayer stand is designed for holding religious texts during prayer sessions. Crafted from premium quality rosewood with intricate hand carvings, this stand adds elegance to your worship space while providing practical functionality.',
      features: [
        'Handcrafted from premium rosewood',
        'Foldable design for easy storage',
        'Traditional carving patterns',
        'Dimensions: 12 x 8 inches (open position)'
      ],
      stock: 30,
      discount: 0,
      tags: ['prayer stand', 'wooden', 'book holder', 'religious text', 'rosewood']
    },
    {
      id: 4,
      name: 'Complete Puja Accessories Kit',
      price: 3999,
      rating: 4.6,
      reviews: 67,
      category: 'puja-items',
      image: '/images/ganesh.jpg',
      description: 'This comprehensive puja kit contains everything needed for performing traditional Hindu rituals. Perfect for daily worship or special occasions, this kit includes a brass thali, bell, diya, incense holder, kumkum container, and more, all packaged in a beautiful presentation box.',
      features: [
        'Contains 15+ essential puja items',
        'Premium quality brass and wood components',
        'Includes storage/carrying box',
        'Comes with a guide for puja rituals'
      ],
      stock: 10,
      discount: 12,
      tags: ['puja kit', 'complete set', 'accessories', 'traditional', 'rituals']
    },
    {
      id: 5,
      name: 'Silver Plated Diya Set',
      price: 1499,
      rating: 4.2,
      reviews: 38,
      category: 'puja-items',
      image: '/images/pujaThali.jpg',
      description: 'This elegant set of silver-plated diyas (traditional oil lamps) is perfect for festive occasions and regular worship. The set includes five diyas of varying sizes with intricate designs that enhance the spiritual ambiance of your home during prayer or celebration.',
      features: [
        'Set of 5 silver-plated diyas in different sizes',
        'Tarnish-resistant coating for durability',
        'Traditional designs with modern finish',
        'Perfect for Diwali and other festivals'
      ],
      stock: 22,
      discount: 7,
      tags: ['diya', 'silver', 'lamp', 'festival', 'decoration']
    },
    {
      id: 6,
      name: 'Lord Krishna Idol',
      price: 1899,
      rating: 4.7,
      reviews: 74,
      category: 'idols',
      image: '/images/ganesh.jpg',
      description: 'This beautiful Lord Krishna idol depicts the deity in his classic flute-playing pose. Crafted with precision and devotion, this statue represents the divine playfulness and spiritual wisdom of Lord Krishna. A perfect addition to your home temple or meditation space.',
      features: [
        'Made from high-quality polyresin with marble finish',
        'Hand-painted with attention to detail',
        'Height: 10 inches',
        'Comes with decorative base'
      ],
      stock: 18,
      discount: 0,
      tags: ['krishna', 'idol', 'statue', 'flute', 'meditation']
    },
    {
      id: 7,
      name: 'Bhagavad Gita (Hardcover)',
      price: 499,
      rating: 4.9,
      reviews: 112,
      category: 'books',
      image: '/images/pujaThali.jpg',
      description: 'This premium hardcover edition of the Bhagavad Gita features the original Sanskrit verses with English translation and commentary. The timeless wisdom of this sacred text is presented in an accessible format with beautiful illustrations throughout.',
      features: [
        'Premium hardcover binding with gold embossing',
        'Original Sanskrit text with pronunciation guide',
        'Detailed commentary and explanations',
        '400 pages with color illustrations'
      ],
      stock: 50,
      discount: 5,
      tags: ['book', 'scripture', 'religious text', 'bhagavad gita', 'spiritual']
    },
    {
      id: 8,
      name: 'Incense Sticks (Premium Pack of 100)',
      price: 299,
      rating: 4.1,
      reviews: 92,
      category: 'puja-items',
      image: '/images/ganesh.jpg',
      description: 'This premium pack contains 100 hand-rolled incense sticks made from natural ingredients and essential oils. The soothing fragrance creates a peaceful atmosphere for meditation, prayer, or relaxation, helping to purify the environment and elevate your spiritual practice.',
      features: [
        '100% natural ingredients with no synthetic chemicals',
        'Long-lasting burn time (approximately 45 minutes each)',
        'Available in sandalwood, jasmine, and rose fragrances',
        'Handcrafted using traditional methods'
      ],
      stock: 100,
      discount: 0,
      tags: ['incense', 'fragrance', 'meditation', 'aromatherapy', 'natural']
    }
  ];
  
  // Puja service data for PujaBooking component
  export const pujaServices = [
    {
      id: 1,
      name: 'Satyanarayan Puja',
      image: '/images/satyanarayan.jpg',
      duration: '3 hours',
      price: 5100,
      rating: 4.8,
      reviews: 126,
      category: 'traditional',
      occasions: ['house-warming', 'new-venture'],
      description: 'Dedicated to Lord Vishnu, Satyanarayan Puja is performed to seek blessings for prosperity, well-being, and success in new ventures. This auspicious ceremony is conducted by our experienced pandits following all Vedic rituals.',
      longDescription: 'Satyanarayan Puja is a sacred Hindu ceremony dedicated to Lord Vishnu, the preserver in the Hindu Trinity. This ritual is performed to express gratitude to the divine and seek blessings for prosperity, well-being, and success in all endeavors. It is particularly auspicious for new beginnings such as house-warming ceremonies, business ventures, or important life events.\n\nOur experienced pandits conduct this ceremony with authentic Vedic rituals, reciting sacred mantras and performing the necessary offerings. The puja includes the recitation of the Satyanarayan Katha (story), which narrates the significance and power of this ritual through ancient tales.\n\nThe ceremony typically lasts for 3 hours and includes all necessary rituals such as Kalash Sthapana, Ganesh Puja, main Satyanarayan worship, havan (fire ritual), and the distribution of prasad (blessed food offerings).',
      requirements: [
        'Fresh flowers and fruits',
        'Betel leaves and nuts',
        'Ghee (clarified butter)',
        'Rice and other grains',
        'Incense sticks and camphor'
      ],
      pandits: [1, 2, 3],
      availableTimeSlots: [
        'Early Morning (4 AM - 6 AM)',
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)',
        'Afternoon (2 PM - 4 PM)',
        'Evening (4 PM - 6 PM)'
      ]
    },
    {
      id: 2,
      name: 'Ganesh Puja',
      image: '/images/ganeshaa.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.7,
      reviews: 98,
      category: 'traditional',
      occasions: ['new-venture', 'festival'],
      description: 'Invoke the blessings of Lord Ganesha, the remover of obstacles, with this traditional puja. Perfect for beginning new ventures, celebrating Ganesh Chaturthi, or seeking divine intervention for success in your endeavors.',
      longDescription: 'The Ganesh Puja is dedicated to Lord Ganesha, the elephant-headed deity who is revered as the remover of obstacles and the harbinger of good fortune. This ceremony is ideal for beginning new ventures, celebrating Ganesh Chaturthi, or seeking divine intervention for success in your endeavors.\n\nDuring this 2-hour ceremony, our experienced pandits invoke Lord Ganesha through sacred mantras and traditional rituals. The puja includes the proper installation of the deity, offering of various items including modak (a sweet dumpling considered to be Lord Ganesha\'s favorite), and the final aarti (ritual of lights).\n\nThis ritual is known to bring wisdom, prosperity, and remove obstacles from one\'s path. It is commonly performed before starting any new project, business, or important life event to ensure successful outcomes.',
      requirements: [
        'Ganesh idol or image',
        'Modak or laddu sweets',
        'Red flowers',
        'Durva grass',
        'Red cloth'
      ],
      pandits: [3, 4],
      availableTimeSlots: [
        'Early Morning (4 AM - 6 AM)',
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)',
        'Afternoon (2 PM - 4 PM)',
        'Evening (4 PM - 6 PM)'
      ]
    },
    {
      id: 3,
      name: 'Lakshmi Puja',
      image: '/images/lakshmi-devi.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.9,
      reviews: 155,
      category: 'prosperity',
      occasions: ['diwali', 'financial-success'],
      description: 'Attract wealth, prosperity and abundance with this sacred puja dedicated to Goddess Lakshmi. Especially auspicious during Diwali, but beneficial throughout the year for financial growth and stability.',
      longDescription: 'Lakshmi Puja is a powerful ritual dedicated to Goddess Lakshmi, the Hindu deity of wealth, fortune, and prosperity. This ceremony is particularly auspicious during the festival of Diwali but can be performed throughout the year to invite financial growth and stability into your life.\n\nOur expert pandits conduct this 2-hour ceremony with traditional Vedic rituals that include creating intricate rangolis (decorative designs), lighting oil lamps, and reciting powerful mantras that invoke the divine presence of the goddess. The ritual culminates with the aarti ceremony and distribution of prasad.\n\nThis puja is highly recommended for those seeking financial prosperity, business success, or a general increase in abundance and well-being in their lives.',
      requirements: [
        'Gold or silver coins',
        'Lotus flowers or red roses',
        'New account book (optional for businesses)',
        'Ghee lamps',
        'Yellow cloth'
      ],
      pandits: [1, 2],
      availableTimeSlots: [
        'Early Morning (4 AM - 6 AM)',
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)',
        'Afternoon (2 PM - 4 PM)',
        'Evening (4 PM - 6 PM)'
      ]
    },
    {
      id: 4,
      name: 'Griha Pravesh Puja',
      image: '/images/ganesh.jpg',
      duration: '3.5 hours',
      price: 5100,
      rating: 4.8,
      reviews: 87,
      category: 'house-warming',
      occasions: ['house-warming'],
      description: 'Begin your journey in your new home with this sacred housewarming ceremony. This comprehensive puja purifies the new space, invites positive energies, and seeks blessings from household deities for peace and harmony.',
      longDescription: 'Griha Pravesh Puja is an essential housewarming ceremony performed when moving into a new home. This comprehensive ritual purifies the living space, invites positive energies, and seeks blessings from household deities for peace, harmony, and prosperity for all residents.\n\nThis 3.5-hour ceremony is conducted by our experienced pandits and includes several key rituals: Vastu Shanti to balance the elemental energies of the home, Navagraha Puja to appease the nine planetary deities, and prayers to various household gods for protection and well-being.\n\nThe ceremony typically begins with the installation of a Kalash (sacred pot) followed by various offerings, havan (fire ritual), and concludes with the symbolic entry into the home. This puja creates a foundation of positive energy in your new dwelling and is believed to bless the home with happiness and prosperity for years to come.',
      requirements: [
        'Copper or brass Kalash',
        'Five types of grains',
        'New cooking pot',
        "Cow's milk and curd",
        'Mango leaves'
      ],
      pandits: [1, 3, 4],
      availableTimeSlots: [
        'Early Morning (4 AM - 6 AM)',
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)',
        'Afternoon (2 PM - 4 PM)',
        'Evening (4 PM - 6 PM)'
      ]
    },
    {
      id: 5,
      name: 'Navgraha Shanti Puja',
      image: '/images/featuredPuja.jpg',
      duration: '2.5 hours',
      price: 5100,
      rating: 4.6,
      reviews: 72,
      category: 'astrological',
      occasions: ['astrological-remedy', 'peace'],
      description: 'Balance the influences of the nine celestial planets in your life with this powerful ritual. Recommended for those facing astrological challenges or seeking to enhance positive planetary influences.',
      longDescription: 'Navgraha Shanti Puja is a specialized ritual designed to pacify and balance the influences of the nine celestial planets (Navagrahas) in your life. In Vedic astrology, these planets are believed to significantly impact various aspects of human existence including health, wealth, career, and relationships.\n\nThis 2.5-hour ceremony is particularly recommended for those facing astrological challenges or difficult planetary periods (dasha), or for those seeking to enhance the positive influences of beneficial planets in their horoscope.\n\nOur knowledgeable pandits perform this ritual by invoking each of the nine planets—Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu—through specific mantras, offerings, and color-coordinated items that correspond to each planetary deity. The ceremony includes a havan (fire ritual) where sacred offerings are made to strengthen the positive aspects of these celestial bodies and mitigate any negative influences.',
      requirements: [
        'Nine types of grains',
        'Nine types of fruits',
        'Nine colors of cloth pieces',
        'Nine types of flowers',
        'Copper or silver coins'
      ],
      pandits: [2, 4],
      availableTimeSlots: [
        'Early Morning (4 AM - 6 AM)',
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)',
        'Afternoon (2 PM - 4 PM)',
        'Evening (4 PM - 6 PM)'
      ]
    },
    {
      id: 6,
      name: 'Rudrabhishek',
      image: '/images/shiv-ling.jpg',
      duration: '2.5 hours',
      price: 5100,
      rating: 4.7,
      reviews: 105,
      category: 'shiva',
      occasions: ['shiva-worship', 'peace'],
      description: 'Honor Lord Shiva with this divine abhishekam ritual. Performed with milk, honey, yogurt, and other sacred offerings, Rudrabhishek brings spiritual growth, removes negativity, and bestows peace and prosperity.',
      longDescription: 'Rudrabhishek is a powerful and sacred abhishekam (bathing ritual) dedicated to Lord Shiva in his Rudra form. This divine ceremony involves bathing the Shiva Lingam with various sacred substances while reciting the Rudra hymns from the Vedas.\n\nDuring this 2.5-hour ceremony, our pandits perform the ritual bathing of the Shiva Lingam with panchamrit (five nectars)—milk, yogurt, honey, ghee, and sugar—along with other substances like water from sacred rivers, rose water, and sandalwood paste. Throughout the abhishekam, powerful Vedic mantras are chanted, creating a deeply spiritual atmosphere.\n\nRudrabhishek is known to bring spiritual growth, remove negativity, bestow peace, and attract prosperity. It is particularly beneficial for those seeking relief from stress, illness, or obstacles, as well as for those on a spiritual path seeking deeper connection with the divine.',
      requirements: [
        'Milk, yogurt, honey, ghee, and sugar',
        'Bilva leaves',
        'Sandalwood paste',
        'Rudraksha beads',
        'Black sesame seeds'
      ],
      pandits: [2, 4],
      availableTimeSlots: [
        'Early Morning (4 AM - 6 AM)',
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)',
        'Afternoon (2 PM - 4 PM)',
        'Evening (4 PM - 6 PM)'
      ]
    },
    {
      id: 7,
      name: 'Kanya Puja',
      image: '/images/featuredPuja.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.5,
      reviews: 63,
      category: 'festival',
      occasions: ['navratri', 'festival'],
      description: 'A significant ritual during Navratri where young girls are worshipped as manifestations of the goddess. This puja honors the divine feminine energy and is believed to bring blessings from Goddess Durga.',
      longDescription: 'Kanya Puja is a beautiful and significant ritual performed during the Navratri festival, where young girls are honored and worshipped as living manifestations of the divine feminine energy, Shakti. This ceremony embodies the reverence for the feminine principle in the universe and is believed to invoke special blessings from Goddess Durga.\n\nIn this 2-hour ceremony, typically 9 young girls (representing the 9 forms of the goddess) are invited, respectfully seated, and worshipped with traditional rituals. Our pandits guide the ceremony where the girls\' feet are washed symbolically, tilak is applied on their foreheads, and they are offered new clothes, accessories, and a festive meal.\n\nThis puja is not only a religious observance but also a beautiful social tradition that instills respect for the feminine divine and fosters community bonding. It is believed that performing Kanya Puja brings prosperity, happiness, and divine grace to the household.',
      requirements: [
        'Gifts for young girls',
        'New clothes (preferably red)',
        'Hair accessories',
        'Homemade food items',
        'Fruits and sweets'
      ],
      pandits: [1, 3],
      availableTimeSlots: [
        'Early Morning (4 AM - 6 AM)',
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)',
        'Afternoon (2 PM - 4 PM)',
        'Evening (4 PM - 6 PM)'
      ]
    },
    {
      id: 8,
      name: 'Sundarkand Path',
      image: '/images/hanumanji.jpg',
      duration: '3 hours',
      price: 5100,
      rating: 4.8,
      reviews: 92,
      category: 'devotional',
      occasions: ['peace', 'obstacle-removal'],
      description: 'A sacred recitation of Sundarkand from the Ramcharitmanas, describing Hanuman\'s journey to Lanka. This powerful path removes obstacles, fulfills wishes, and brings peace and prosperity to the household.',
      longDescription: 'Sundarkand Path is a sacred recitation from the fifth chapter of the Ramcharitmanas, an epic poem by Tulsidas based on the Ramayana. This chapter specifically narrates Lord Hanuman\'s journey to Lanka in search of Goddess Sita, symbolizing devotion, courage, and victory over obstacles.\n\nDuring this 3-hour ceremony, our experienced pandits recite the entire Sundarkand with proper pronunciation, rhythm, and devotion. The recitation is accompanied by traditional rituals including lighting of lamps, offering of flowers and incense, and occasional explanations of key passages to help participants understand the spiritual significance.\n\nRegular recitation of Sundarkand is believed to remove obstacles from one\'s life, fulfill wishes, bring peace to the household, and protect the family from negative influences. It is particularly recommended during challenging times, when starting new ventures, or as a regular spiritual practice for overall well-being.',
      requirements: [
        'Hanuman Chalisa books for attendees',
        'Red cloth',
        'Oil lamps',
        'Sindoor (vermilion)',
        'Flowers and incense'
      ],
      pandits: [3],
      availableTimeSlots: [
        'Early Morning (4 AM - 6 AM)',
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)',
        'Afternoon (2 PM - 4 PM)',
        'Evening (4 PM - 6 PM)'
      ]
    },
    {
      id: 10,
      name: 'Astrological Consultation',
      image: '/images/featuredPuja.jpg',
      duration: '1 hour',
      price: 2500,
      rating: 4.9,
      reviews: 152,
      category: 'consultation',
      occasions: ['career-guidance', 'marriage', 'health', 'spiritual-growth'],
      description: 'Receive personalized astrological guidance based on your birth chart from our experienced Vedic astrologers. Understand planetary influences and receive remedies for harmonizing cosmic energies.',
      longDescription: 'Our Astrological Consultation service provides in-depth analysis of your birth chart (Janam Kundali) by our team of experienced Vedic astrologers. Each consultation is personalized to address your specific concerns and provide guidance for various aspects of life including career, relationships, health, and spiritual growth.\n\nDuring the consultation, our astrologers will analyze the position of all nine planets (Navagraha) at the time of your birth and explain how these cosmic energies influence different aspects of your life. You will receive insights about your strengths, challenges, and potential opportunities based on planetary positions.\n\nThe session also includes personalized remedial measures such as gemstone recommendations, mantras, and specific rituals that can help you harmonize challenging planetary influences and enhance positive ones. Our astrologers combine traditional Vedic knowledge with practical modern advice to provide guidance that is both spiritually grounded and applicable to contemporary life.\n\nThis service is ideal for those seeking clarity during important life transitions, making major decisions, or simply wanting to gain deeper self-awareness through the ancient wisdom of Vedic astrology.',
      requirements: [
        'Your exact date, time, and place of birth (if available)',
        'List of specific questions or concerns you wish to address',
        'Details of any previous astrological consultations or remedies performed'
      ],
      pandits: [1, 3, 4],
      availableTimeSlots: [
        'Early Morning (4 AM - 6 AM)',
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)',
        'Afternoon (2 PM - 4 PM)',
        'Evening (4 PM - 6 PM)'
      ]
    }
  ];
  
  // Sample pandit data
  export const pandits = [
    {
      id: 1,
      name: "Pandit Ramesh Sharma",
      image: "/images/ganesh.jpg",
      experience: "15+ years",
      specialization: "Satyanarayan Puja, Griha Pravesh",
      rating: 4.9,
      reviews: 132,
      languages: ["Hindi", "Sanskrit", "English"],
      availability: true,
      description: "Pandit Ramesh Sharma is a highly respected priest with over 15 years of experience in performing various Vedic rituals. He has deep knowledge of Sanskrit texts and specializes in Satyanarayan Puja and Griha Pravesh ceremonies. Known for his precise pronunciation of mantras and thorough explanations of ritual significance, Pandit Ramesh ensures that each ceremony is performed with authenticity and spiritual depth."
    },
    {
      id: 2,
      name: "Pandit Suresh Joshi",
      image: "/images/featuredPuja.jpg",
      experience: "20+ years",
      specialization: "Navgraha Puja, Rudrabhishek",
      rating: 4.8,
      reviews: 98,
      languages: ["Hindi", "Sanskrit", "Gujarati"],
      availability: true,
      description: "With more than two decades of experience, Pandit Suresh Joshi is an expert in astrological remedies and Shiva-related rituals. His profound understanding of Vedic astrology makes him particularly adept at performing Navgraha Shanti Puja and Rudrabhishek ceremonies. Pandit Suresh is known for his calm demeanor, spiritual wisdom, and ability to explain complex astrological concepts in simple terms."
    },
    {
      id: 3,
      name: "Pandit Vijay Trivedi",
      image: "/images/ganesh.jpg",
      experience: "12+ years",
      specialization: "Ganesh Puja, Lakshmi Puja",
      rating: 4.7,
      reviews: 85,
      languages: ["Hindi", "Sanskrit", "English", "Marathi"],
      availability: true,
      description: "Pandit Vijay Trivedi brings 12 years of experience and a modern approach to traditional rituals. He excels in performing Ganesh Puja and Lakshmi Puja with detailed explanations that connect ancient practices to contemporary life. Multilingual and approachable, Pandit Vijay makes ceremonies accessible to everyone, regardless of their familiarity with Hindu traditions. His ceremonies are known for being both authentic and engaging."
    },
    {
      id: 4,
      name: "Pandit Karan Shastri",
      image: "/images/featuredPuja.jpg",
      experience: "18+ years",
      specialization: "Kaal Sarp Dosh Nivaran, Maha Mrityunjaya Japa",
      rating: 4.9,
      reviews: 115,
      languages: ["Hindi", "Sanskrit", "Bengali"],
      availability: true,
      description: "Pandit Karan Shastri is renowned for his expertise in remedial rituals, particularly those addressing astrological afflictions. With 18 years of experience, he specializes in Kaal Sarp Dosh Nivaran and Maha Mrityunjaya Japa, powerful ceremonies aimed at removing obstacles and providing protection. His deep knowledge of ancient texts, combined with compassionate guidance, has helped many individuals navigate challenging periods in their lives with spiritual support."
    }
  ];
  
  // Function to get suggested products based on a product
  export const getSuggestedProducts = (productId) => {
    // Find the current product
    const currentProduct = products.find(product => product.id === parseInt(productId));
    
    if (!currentProduct) return [];
    
    // Get products in the same category, excluding the current one
    return products
      .filter(product => 
        product.category === currentProduct.category && 
        product.id !== currentProduct.id
      )
      .slice(0, 3); // Return up to 3 suggestions
  };
  
  /**
   * Get suggested pujas based on a puja ID or category
   * @param {number|string} pujaIdOrCategory - Either a puja ID or category
   * @param {number} limit - Maximum number of suggested pujas to return
   * @returns {Array} - Array of suggested pujas
   */
  export const getSuggestedPujas = (pujaIdOrCategory, limit = 3) => {
    // Check if input is a puja ID
    const isId = typeof pujaIdOrCategory === 'number' || !isNaN(parseInt(pujaIdOrCategory));
    
    if (isId) {
      // Convert to number if string number was passed
      const pujaId = parseInt(pujaIdOrCategory);
      const targetPuja = pujaServices.find(puja => puja.id === pujaId);
      
      if (!targetPuja) return [];
      
      // First, try to find pujas in the same category
      let suggested = pujaServices.filter(puja => 
        puja.id !== pujaId && 
        puja.category === targetPuja.category
      );
      
      // If we don't have enough, add pujas with similar occasions
      if (suggested.length < limit && targetPuja.occasions) {
        const otherPujas = pujaServices.filter(puja => 
          puja.id !== pujaId && 
          puja.category !== targetPuja.category
        );
        
        // Score pujas by matching occasions
        const scoredPujas = otherPujas.map(puja => {
          let score = 0;
          if (puja.occasions && puja.occasions.length && targetPuja.occasions.length) {
            targetPuja.occasions.forEach(occasion => {
              if (puja.occasions.includes(occasion)) score += 1;
            });
          }
          return { ...puja, score };
        });
        
        // Add top matches
        scoredPujas
          .sort((a, b) => b.score - a.score)
          .filter(puja => puja.score > 0)
          .forEach(puja => {
            if (suggested.length < limit && !suggested.some(s => s.id === puja.id)) {
              suggested.push(puja);
            }
          });
      }
      
      // If still not enough, add random pujas
      if (suggested.length < limit) {
        const remainingPujas = pujaServices.filter(puja => 
          puja.id !== pujaId && !suggested.some(s => s.id === puja.id)
        );
        
        // Shuffle array
        const shuffled = [...remainingPujas].sort(() => 0.5 - Math.random());
        
        // Add random pujas until we reach the limit
        shuffled.forEach(puja => {
          if (suggested.length < limit) {
            suggested.push(puja);
          }
        });
      }
      
      return suggested.slice(0, limit);
    } else {
      // Category was passed, return pujas in that category
      const category = pujaIdOrCategory;
      let suggested = pujaServices.filter(puja => puja.category === category);
      
      // If not enough in category, add random pujas
      if (suggested.length < limit) {
        const otherPujas = pujaServices.filter(puja => puja.category !== category);
        const shuffled = [...otherPujas].sort(() => 0.5 - Math.random());
        
        shuffled.forEach(puja => {
          if (suggested.length < limit) {
            suggested.push(puja);
          }
        });
      }
      
      return suggested.slice(0, limit);
    }
  };
  
  // Function to get a pandit by ID
  export const getPanditById = (id) => {
    return pandits.find(pandit => pandit.id === parseInt(id));
  };
  
  // Cart items will be managed through React state/context in the application

  /**
   * Get related products based on a given product
   * @param {Object} product - The product to find related items for
   * @param {number} limit - Maximum number of related products to return
   * @returns {Array} - Array of related products
   */
  export const getRelatedProducts = (product, limit = 4) => {
    if (!product) return [];
    
    // First try to find products in the same category
    let related = products.filter(item => 
      item.id !== product.id && 
      item.category === product.category
    );
    
    // If not enough products in the same category, add products with similar tags
    if (related.length < limit && product.tags && product.tags.length) {
      const otherProducts = products.filter(item => 
        item.id !== product.id && 
        item.category !== product.category
      );
      
      // Score products by matching tags
      const scoredProducts = otherProducts.map(item => {
        let score = 0;
        if (item.tags && item.tags.length) {
          product.tags.forEach(tag => {
            if (item.tags.includes(tag)) score += 1;
          });
        }
        return { ...item, score };
      });
      
      // Sort by score and add top matches
      scoredProducts
        .sort((a, b) => b.score - a.score)
        .forEach(item => {
          if (related.length < limit && item.score > 0 && !related.some(r => r.id === item.id)) {
            related.push(item);
          }
        });
    }
    
    // If still not enough, add random products
    if (related.length < limit) {
      const remainingProducts = products.filter(item => 
        item.id !== product.id && !related.some(r => r.id === item.id)
      );
      
      // Shuffle array
      const shuffled = [...remainingProducts].sort(() => 0.5 - Math.random());
      
      // Add random products until we reach the limit
      shuffled.forEach(item => {
        if (related.length < limit) {
          related.push(item);
        }
      });
    }
    
    return related.slice(0, limit);
  };