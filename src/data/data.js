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
    },
    {
      id: 11,
      name: '1.	Akhand Ramayan Path',
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
    },
    {
      id: 12,
      name: 'Bhumi Pujan',
      image: '/images/satyanarayan.jpg',
      duration: '3 hours',
      price: 5100,
      rating: 4.8,
      reviews: 126,
      category: 'traditional',
      occasions: ['house-warming', 'new-venture'],
      description: 'Dedicated to Vastu Purusha, Mother Bhoomi & Pancha Bootha. Remove negative impact & Vastu dosha from site. Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.',
      longDescription: `Before building on a piece of land or working the land, Bhoomi Puja is done. Bhoomi, which means Earth, is seen as the Mother of everything. By doing this puja, we are asking for permission to do what we want to do and asking for forgiveness for upsetting Mother Earth's balance and equilibrium. During the Puja, we chant special Vedic sutras and hymns to make peace with the different energies in the space and to keep away any bad energies. Bhoomi Puja is done to give the building good luck and fortune. It is done to ask God for his blessings so that the building can be finished without any problems or surprises. Also to ask Mother Earth for forgiveness for messing up the natural habitat. Goddess Bhoomi and the god of architecture, Vastu Purush, are the recipients of worship during a ceremony of bhoomi pooja.,

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam 
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Bhumi & Vastu Dosh Puja
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included as per tradition (see details in description)',
        'Clean site for puja setup',
        'Access to water and basic utilities'
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
  id: 13, // Use the next available unique ID
  name: 'Akhand Ramayan Path',
  image: '/images/satyanarayan.jpg', // Update with your image path
  duration: '24 hours',
  price: 7100,
  rating: 4.9,
  reviews: 80,
  category: 'path',
  occasions: ['spiritual', 'remedy'],
  description: "Recital of 'Shri Ramcharitmanas'. Honor Rama as a symbol of wisdom, moral behavior, and admirable qualities.",
  longDescription: ` The Akhand Ramayan Path involves reciting the entire Shri Ram Charitra Manas continuously for a full day. The readings are not interspersed. Seven kaands—Baalkand, Ayodhyakand, Aranyakand, Kishkindhakand, Sundarkand, Lankakand, and Uttarkand—are covered throughout the entire text. The various lives and actions of Lord Shree Ram are detailed in each of the kaands.
By following this path, you can overcome obstacles in your life and attract good fortune. The main panditji leads this route, starting with the Gauri Ganesh Kalash Puja. While a group of pandits play kirtans and bhajans on the Dholak, Manjeera, and other instruments in worship of the Lord Shri Ram, he reads the route.
Get the best deal on all puja and havan samagri materials when you book a pandit online with PujaKaro.in. Get spiritual and ritual divinity without any hassles.
Puja Vidhi:
• Shuddhikaran
• Swastivachan
• Sankalp
• Kalash Puja & Sacred Element Worship
• Gauri Ganesh Puja
• Shodash Matrika, Saptghrit Matrika, Navgrah, Panch Lokpal, Dash Dikpal & Chausath Yogini Pujan
• Mukhya Puja Vidhi
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran
Puja Samagri: Haldi, Kumkum, Akshata, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`
,
  requirements: [
    'All Puja Samagri & Havan Samagri included as per tradition (see details in description)',
    'Clean site for puja setup',
    'Access to water and basic utilities'
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
},{
  id: 13,
  name: 'Akhand Ramayan Path',
  image: '/images/satyanarayan.jpg',
  duration: '24 hours',
  price: 7100,
  rating: 4.9,
  reviews: 80,
  category: 'path',
  occasions: ['spiritual', 'remedy'],
  description: "Recital of 'Shri Ramcharitmanas' [without break]. Honor Rama as a symbol of wisdom, moral behavior, and admirable qualities.",
  longDescription: `Description: The Akhand Ramayan Path involves reciting the entire Shri Ram Charitra Manas continuously for a full day. The readings are not interspersed. Seven kaands—Baalkand, Ayodhyakand, Aranyakand, Kishkindhakand, Sundarkand, Lankakand, and Uttarkand—are covered throughout the entire text.
By following this path, you can overcome obstacles in your life and attract good fortune. The main panditji leads this route, starting with the Gauri Ganesh Kalash Puja. While a group of pandits play kirtans and bhajans on the Dholak, Manjeera, and other instruments in worship of the Lord Shri Ram, he reads the route.
Puja Vidhi:
• Shuddhikaran
• Swastivachan
• Sankalp
• Kalash Puja & Sacred Element Worship
• Gauri Ganesh Puja
• Shodash Matrika, Saptghrit Matrika, Navgrah, Panch Lokpal, Dash Dikpal & Chausath Yogini Pujan
• Mukhya Puja Vidhi
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran
Puja Samagri: Haldi, Kumkum, Akshata, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included as per tradition',
    'Clean site for puja setup',
    'Access to water and basic utilities'
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
  id: 14,
  name: 'Akshara Abhyasam',
  image: '/images/satyanarayan.jpg',
  duration: '2 hours',
  price: 4100,
  rating: 4.8,
  reviews: 60,
  category: 'sanskar',
  occasions: ['education', 'child'],
  description: "A Hindu ceremony marking a child's official start of schooling. Seeks blessings of Ganesha and Saraswati for wisdom.",
  longDescription: `Description: Akshara Abhyasam, also known as Vidyarambham or Aksharabhyas, signifies a child's official start of schooling. It is important in Hindu tradition as it marks the beginning of a lifetime of study and wisdom, aiming to obtain the blessings of Ganesha (the Remover of Obstacles) and Saraswati (the Goddess of Knowledge).
Puja Vidhi:
• The priest or elder holds the child’s hand and helps them write the first letters: OM, Aa, Hare Rama Hare Krishna, Om Namah Sivay
• Swasti Vachnam
• Shodasha Upachara Puja
• Gauri Ganesh Puja
• Punyaha Vachnam
• Maha Sankalpam
• Kalash & Navgrah Puja
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran
Puja Samagri: Haldi, Kumkum, Akshata, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'Child (age 2-5) and parents present',
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [1, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Late Morning (10 AM - 12 PM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 15,
  name: 'Akshay Tritiya Puja',
  image: '/images/satyanarayan.jpg',
  duration: '2 hours',
  price: 4100,
  rating: 4.7,
  reviews: 55,
  category: 'festival',
  occasions: ['new-beginnings', 'prosperity'],
  description: "Highly auspicious day for new beginnings. Prayers to Lord Vishnu, Ganesha, and Lakshmi.",
  longDescription: `Akshay Tritiya is considered a highly auspicious day for new beginnings and is particularly important in Hindu tradition. The day is celebrated with specific rituals, including prayers to Lord Vishnu, Lord Ganesha, and Goddess Lakshmi, along with the worship of the Kalash (sacred water pot).
Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Laxmi Narayana Puja
• Punyaha Vachnam
• Maha Sankalpam
• Ganapati Puja
• Kalash & Navgrah Puja
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran
Puja Samagri: Haldi, Kumkum, Akshata, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [2, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Late Morning (10 AM - 12 PM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 17,
  name: 'Anniversary Puja',
  image: '/images/satyanarayan.jpg',
  duration: '2 hours',
  price: 5100,
  rating: 4.9,
  reviews: 70,
  category: 'special',
  occasions: ['marriage', 'anniversary'],
  description: "Obtain blessings of Maa Parvati & Shiva for a happy married life. Rekindle love and harmony.",
  longDescription: ` A wedding anniversary puja is performed by couples on their anniversary, honoring Lord Shiva and Goddess Parvati. This puja ensures a tranquil and successful married life, rekindling love between life partners and saving shattered marriages.
Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Agni Pratishtha
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran
Puja Samagri: Haldi, Kumkum, Akshata, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'Couple present',
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [1, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Late Morning (10 AM - 12 PM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 18,
  name: 'Ark Vivah (for Male: Manglik)',
  image: '/images/satyanarayan.jpg',
  duration: '2.5 hours',
  price: 6100,
  rating: 4.8,
  reviews: 45,
  category: 'astrological',
  occasions: ['manglik-dosh', 'remedy'],
  description: "Ark Vivah assists a male in getting rid of Manglik dosha in his horoscope.",
  longDescription: ` Ark Vivah assists a male in getting rid of Manglik dosha in his horoscope. Mangal Graha is the most malefic planet for marriage, and its presence in specific houses causes Mangalik dosh. PujaKaro.in Pandit Ji does the Gouri Gomesh Kalash Navgraha puja, followed by chanting the Vishnu and Mangal Jaaps. A havan is conducted, followed by Vivah in accordance with the Shastras using the Ark plant.
Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Sarvatobhadra Puja
• Ark Vivah
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran
Puja Samagri: Haldi, Kumkum, Akshata, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'Male with Manglik dosha',
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [2, 4],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Late Morning (10 AM - 12 PM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 19,
  name: 'Ashta Matrika Puja',
  image: '/images/satyanarayan.jpg',
  duration: '2 hours',
  price: 5100,
  rating: 4.7,
  reviews: 38,
  category: 'devi',
  occasions: ['protection', 'spiritual-growth'],
  description: "Invokes eight powerful forms of the Divine Mother for protection, strength, and energy purification.",
  longDescription: `Ashta Matrika Puja holds great spiritual importance as it invokes eight powerful forms of the Divine Mother for protection, strength, and energy purification. These goddesses represent different aspects of Shakti and help destroy negative forces, boost inner power, and ensure peace, prosperity, and spiritual growth.
Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Mahavidya Mantra Pujan Havan
• Aarti & Prasad Vitaran
Puja Samagri: Haldi, Kumkum, Akshata, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [1, 4],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Late Morning (10 AM - 12 PM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 20,
  name: 'Ayush Havan',
  image: '/images/ayush-havan.jpg',
  duration: '2 hours',
  price: 5100,
  rating: 4.8,
  reviews: 44,
  category: 'health',
  occasions: ['health', 'longevity'],
  description: "Lord Ayur Devata [incarnation of Lord Vishnu] divine physician for all the three worlds. For long, healthy life.",
  longDescription: `The main goal of the Ayush Havan is to make people live longer by making their various health problems less severe. The primary objective is to win the favour of Ayur Devata, often known as the God of life. Everyone can increase their chances of living a long and healthy life if they participate in this havan.
Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Ayur Devta Puja
• Chants of Sri Sukta (*21)
• Ayur Devta Havan Karyakram Sampannam
• Aarti & Prasad Vitaran
Puja Samagri: Haldi, Kumkum, Akshata, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [2, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Late Morning (10 AM - 12 PM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 20,
  name: 'Diwali Laxmi Puja',
  image: '/images/satyanarayan.jpg',
  duration: '2 hours',
  price: 5100,
  rating: 4.9,
  reviews: 120,
  category: 'festival',
  occasions: ['diwali', 'prosperity'],
  description: "Symbolic victory of good over evil and knowledge over ignorance. Invite prosperity, wealth, health and abundance.",
  longDescription: `Maya is the goddess Lakshmi. She never stays in one place for long. Because of this, Goddess Lakshmi is also known by the name Chanchala. This means that we move very quickly from one place to another without realising it. It's hard to get her permission and keep her in our house for a long time.
The day of Laxmi Puja is the dark night of Amavasya. Even though it's dark at night, people make it brighter by lighting a lot of candles. They also give Goddess Laxmi a big diya with lights in all four directions so that their lives will be full of light from all directions.
During Diwali, the Goddess Mahalakshmi goes to every home to bring luck, wealth, and other blessings. When you celebrate Diwali Lakshmi puja, you can get Goddess Lakshmi's blessings and bring wealth, health, and plenty into your home. Also, if you worship Lakshmi, you can reach your real goals in life. Because she is the thing that helps you get where you want to go.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Laxmi Puja
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [1, 2, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Late Morning (10 AM - 12 PM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},

     {
      id: 20,
      name: 'Diwali Laxmi Puja',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.9,
      reviews: 120,
      category: 'festival',
      occasions: ['diwali', 'prosperity'],
      description: "Symbolic victory of good over evil and knowledge over ignorance. Invite prosperity, wealth, health and abundance.",
      longDescription: `Description: Maya is the goddess Lakshmi. She never stays in one place for long. Because of this, Goddess Lakshmi is also known by the name Chanchala. This means that we move very quickly from one place to another without realising it. It's hard to get her permission and keep her in our house for a long time.
The day of Laxmi Puja is the dark night of Amavasya. Even though it's dark at night, people make it brighter by lighting a lot of candles. They also give Goddess Laxmi a big diya with lights in all four directions so that their lives will be full of light from all directions.
During Diwali, the Goddess Mahalakshmi goes to every home to bring luck, wealth, and other blessings. When you celebrate Diwali Lakshmi puja, you can get Goddess Lakshmi's blessings and bring wealth, health, and plenty into your home. Also, if you worship Lakshmi, you can reach your real goals in life. Because she is the thing that helps you get where you want to go.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Laxmi Puja
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [1, 2, 3],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 21,
      name: 'Durga Abhishekam',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.8,
      reviews: 95,
      category: 'devi',
      occasions: ['durga', 'spiritual-growth'],
      description: "Ceremonial bathing (Abhishekam) of Maa Durga's idol or Yantra with various holy substances, each holding spiritual significance.",
      longDescription: `Description: It involves the ceremonial bathing (Abhishekam) of Maa Durga's idol or Yantra with various holy substances, each holding spiritual significance. Ganga Jal purifies the idol and environment. Panchamrit (mixture of 5 sacred liquids): Cow's Milk - Purity and nourishment, Curd - Prosperity and bliss, Honey - Sweetness in life, Sugar - Happiness and harmony, Ghee - Spiritual enlightenment, Coconut Water - Prosperity and well-being, Rose Water - Enhances divine aura, Saffron Water (Kesar Jala) - Royal blessings, Turmeric Water (Haldi Jala) - Health and protection, Kumkum Water (Sindoor Jala) - Goddess's grace, Sandalwood Paste (Chandan Jala) - Peace and divine energy, Holy Ash (Bhasma) - Protection from negative energies, Sugarcane Juice - Attracts wealth and success, Fruit Juices (Mango, Pomegranate, etc.) - Fulfillment of desires.
Book Pandit ji for Durga Abhishekam at your preferred location | PujaKaro.in

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Durga Abhishekam
• 108 Names of Durga Maa
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [2, 3],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 22,
      name: 'Durga Saptashati Path',
      image: '/images/satyanarayan.jpg',
      duration: '3 hours',
      price: 6100,
      rating: 4.9,
      reviews: 110,
      category: 'devi',
      occasions: ['durga', 'spiritual-growth'],
      description: "Path encompasses 4 facets of life: Faith (dharma), Facts (Arth), Desire (Kaam), and Freedom from rebirth (Moksha).",
      longDescription: `Description: In the ancient Vedic text Durga Saptashati, Devi is described as the most powerful and creative force of the Supreme Absolute. She is part of the Markandeya Puran, so she is also called Devi Mahatmya. This path tells the story of a fierce battle between good and evil in which Devi took the form of Durga to lead the good forces against the demon king Mahishasura. Lakshmi is the goddess or creative energy that brings wealth and happiness to the world. Durga Saptashati says that you should do Candi Homa to get healthy and stop being afraid of the enemy.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Durga Saptashati Path
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [1, 4],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 23,
      name: 'Dusshera Puja',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.8,
      reviews: 90,
      category: 'festival',
      occasions: ['dusshera', 'victory'],
      description: "Symbolises triumph of good over evil. Celebrates the victory of Lord Rama over Ravana.",
      longDescription: `Description: Dussehra, also known as Dasara and Vijayadashami, is a Hindu festival celebrating the vanquishing of the demon king Ravana and the rescue of Rama's wife Sita. The name of the celebration comes from the Sanskrit terms for "ten" (dasha) and "defeat" (hara). On the tenth day of Ashvina (September-October), the seventh month of the Hindu calendar, the full moon appears, ushering in the "bright fortnight" that marks the beginning of the festival of Dussehra and symbolises the triumph of good over evil (shukla paksha). As the tenth and final day of the Durga Puja and Navratri festivals, Dussehra marks the conclusion of two major Hindu celebrations. Many people start getting ready for Diwali, which is celebrated 20 days following Dussehra.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Dusshera Puja
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [2, 3],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 24,
      name: 'Engagement Puja',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.7,
      reviews: 85,
      category: 'special',
      occasions: ['marriage', 'engagement'],
      description: "Ceremony to get blessings for upcoming wedding. Conducted to fix the marriage date, marked by exchange of rings.",
      longDescription: `Description: The primary purpose of the engagement ceremony is to determine the date of the wedding. The engagement ceremony is where the bride and groom exchange rings. Many people think of an engagement party as the event that sets the tone for the rest of the celebrations.
In India, Hindu weddings are still very traditional and based on Vedic customs and old ideas. According to Indian tradition, the newly formed bond between the two souls must also have God's unqualified approval.
The rings symbolise a sacred link that calls for unwavering devotion and fidelity from both parties. After exchanging rings, the bride-to-be and groom-to-be will be blessed by the elders of both families and treated to delicacies. Garlands are often exchanged after the ring ceremony as a symbol of good luck and prosperity for the soon-to-be wed.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Patrika Puja
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [1, 3],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 25,
      name: 'Ganapati Puja',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.9,
      reviews: 100,
      category: 'traditional',
      occasions: ['ganesh', 'new-beginnings'],
      description: "Lord of Gana (common people). God of new beginnings and discriminating intellect to attain perfection in life.",
      longDescription: `Description: It is the birthday of Lord Ganesha, who has the head of an elephant. Ganesha is recognised as the God of money, sciences, knowledge, wisdom, and success, which is why the majority of Hindus pray to him before beginning any significant endeavour.
This puja, or ceremony, is held to bestow good fortune upon the newlyweds and their families so that any barriers they may face are eliminated. In the Hindu religion, every auspicious ceremony begins with a prayer to Lord Ganesh.
After washing the feet of Lord Ganesha, worshippers bathe the idol in milk, ghee, honey, curd, and sugar (panchamrit snan). Following this is perfumed oil and ganga jal. The idol is then presented with new garments, flowers, unbroken rice (Akshata), a garland, sindoor, and chandan.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Ganesh Sthapana
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [2, 4],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 26,
      name: 'Ganapati Strotam',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 4100,
      rating: 4.7,
      reviews: 70,
      category: 'devotional',
      occasions: ['ganesh', 'obstacle-removal'],
      description: "Reciting Ganesha Stotram is one of the most powerful ways to appease Ganpati Ji. Removes all problems, hurdles and evil energies.",
      longDescription: `Description: Reciting Ganesha Stotram is one of the most powerful ways to appease Ganpati Ji. The significance of Ganesha Stotram is mentioned in Narada Puran and it is believed that reciting this Stotram eliminates all the problems, hurdles and evil energies.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Ganesh Sthapana
• Ganapati Strotam
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [1, 3],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 27,
      name: 'Gand Mool Nakshatra',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.8,
      reviews: 60,
      category: 'astrological',
      occasions: ['nakshatra', 'remedy'],
      description: "Shanti puja done to reduce the malefic impact if born in Akashvani, Ashlesha, Magha, Jyeshtha, Mool & Revati.",
      longDescription: `Description: Mool Nakshatra Within twenty-seven days after a person's birth, Shanti Puja is recommended to dispel questions regarding their nakshatra. In addition, if the ritual is not done within the prescribed time frame for whatever reason, it can be prolonged to a period of either 27 months or 27 years, with the latter option being preferred.
Eleven thousand planetary mantras are recited during this process. For puja, the leaves of 27 different plants were gathered, as well as water from 27 distinct locations. According to the vidhi, gifts are presented to the twenty-seven Brahmins following the completion of the puja.
This ritual will only be conducted if the infant is born during the mool nakshatras. The removal of the negative effects of mool nakshatras is enhanced by wearing gemstones and completing this puja practise.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Nakshatra Jaap
• Abhishek
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [2, 4],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 28,
      name: 'Ganesh Atharvashirsha Path',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.9,
      reviews: 80,
      category: 'devotional',
      occasions: ['ganesh', 'spiritual-growth'],
      description: "The Ganapati Atharvashirsha, also called the Ganapati Upanishad, is a Sanskrit text dedicated to Lord Ganesha.",
      longDescription: `Description: The Ganapati Atharvashirsha, also called the Ganapati Upanishad, is a Sanskrit text dedicated to Lord Ganesha, the remover of obstacles and a beloved deity in Hinduism. This hymn is revered as a part of the Atharva Veda tradition and is considered one of the foundational texts for Ganesha worship.
Book pandit online for Ganesh Atharvashirsha path at home | PujaKaro.in

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Ganesh Atharvashirsha Path
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [1, 2],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 29,
      name: 'Ganesh Sthapana',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.8,
      reviews: 75,
      category: 'traditional',
      occasions: ['ganesh', 'festival'],
      description: "'Sthapana' - establishment of Lord Ganesha at home. He who is Vighnaharta (Obstacle destroyer).",
      longDescription: `Description: Lord Ganesh is said to have been born during Madhyana, making midday the most auspicious time for Ganesh puja, also known as Shodashhopachala Ganapati puja. On this day, Lord Ganesha idols are taken home for Ganesh's Sthapana, and people worship him every day for ten days. On Anant Chaturdashi, worshippers immerse an idol of Lord Ganesha in water.
The ritual is performed to represent Lord Ganesha's birth cycle; just as he was produced from clay and earth, so is his symbolic statue. The idol is immersed in water in order for Ganesha to return to his home after his "stay" at the devotees' home or temple, where the Ganesha Chaturthi rites are performed. Lord Ganesha is adored in all 16 ceremonies while Pranik's mantras are chanted.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Ganesh Sthapana

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [2, 3],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
      id: 30,
      name: 'Ganesh Visarjan',
      image: '/images/satyanarayan.jpg',
      duration: '2 hours',
      price: 5100,
      rating: 4.9,
      reviews: 90,
      category: 'festival',
      occasions: ['ganesh', 'moksha'],
      description: "'Visarjan' is symbolic of immersion of all life obstacles along with the Ganpathi idol and depicts concept of 'Moksha'.",
      longDescription: `Description: On the final day of the Ganesha Festival, the Ganesha Visarjan custom is carried out. An alternative name for the final day of the 10-day festival is Anant Chaturdashi. As the term 'Visarjan' indicates, on this day the idol of Lord Ganapati is immersed in a river, sea, or other body of water. On the first day of the festival, devotees mark the commencement of Ganesha's chaturthi by installing Ganesha statues in their homes, businesses, and public spaces. On the final day, worshippers carry their beloved God's idols in procession and immerse them. On the final day of the festival, Lord Ganesha is supposed to return to Mount Kailash to reunite with his parents, Lord Shiva and Goddess Parvati.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Ganapati Visarjan Puja
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.

Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
      requirements: [
        'All Puja Samagri & Havan Samagri included',
        'Clean site for puja setup'
      ],
      pandits: [1, 4],
      availableTimeSlots: [
        'Morning (6 AM - 8 AM)',
        'Late Morning (8 AM - 10 AM)',
        'Late Morning (10 AM - 12 PM)',
        'Afternoon (12 PM - 2 PM)'
      ]
    },
    {
  id: 31,
  name: 'Garud Puran Path',
  image: '/images/garud-puran.jpg',
  duration: '2 hours',
  price: 4100,
  rating: 4.8,
  reviews: 40,
  category: 'path',
  occasions: ['ancestor', 'moksha'],
  description: "Garud Puran Path is a sacred recitation believed to fulfill wishes, grant happiness, and provide moksha (liberation) to the departed souls of ancestors. This ancient scripture is recited during mourning periods to bring peace to the departed and solace to the living. The Garud Puran explores the journey of the soul after death, the importance of righteous living, and the rituals that help ensure a smooth transition for the soul. Performing this path is considered a sacred duty in Hindu tradition, connecting the material and spiritual worlds and offering blessings to both the deceased and their families.",
  longDescription: `Garud Puran Path, an ancient Hindu scripture, holds significant cultural and spiritual importance. According to folklore, reciting or listening to its verses is believed to grant peace to the departed souls and solace to the living. The text delves into various aspects of life, death, and the afterlife, outlining rituals and customs to ensure the proper passage of the soul. Legends recount instances where the faithful conduct Garud Puran Path ceremonies during mourning periods, seeking divine guidance and blessings for the deceased. It's considered a sacred duty to perform this recitation, serving as a bridge between the material and spiritual realms in Hindu tradition.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Garud Puran Path
• Aavahan
• Shuddhi
• Bhoga
• Ritual & Spiritual Fulfilment

Puja Samagri: Only Paath, Aasan & Chawki`,
  requirements: [
    'Only Paath, Aasan & Chawki required',
    'Clean site for puja setup'
  ],
  pandits: [1, 2],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 32,
  name: 'Gayatri Havan',
  image: '/images/gayatri-havan.jpg',
  duration: '2 hours',
  price: 5100,
  rating: 4.9,
  reviews: 60,
  category: 'havan',
  occasions: ['prosperity', 'spiritual-growth'],
  description: "Gayatri Havan is a powerful Vedic ritual dedicated to Goddess Gayatri, the embodiment of the essence of the four Vedas and the trinity of senses, mind, and speech. This havan invokes the blessings of Gayatri, Savitri, and Saraswati for wisdom, clarity, and spiritual upliftment. The ritual is believed to purify the mind, remove obstacles, and bring prosperity, health, and success. Regular chanting of the Gayatri Mantra during the havan is said to bestow divine protection and fulfill all forms of prosperity in life.",
  longDescription: `Gayatri Havan is a celebration held to honour the goddess Gayatri, which translates to "three deities: Gayatri, Savitri, and Saraswathi." Gayatri represents the senses; Savitri represents truth; and Saraswathi represents communication.
Lord Surya is linked to this havan. Gayatri is the conduit through which the sun's delicate shape transports power. Gayatri means "protection channel," because ga indicates movement and yatri represents protection.
She is also thought to be the feminine version of the sun goddess. Singing her Gayatri Mantra on a regular basis is said to bring numerous blessings into one's life. The Gayatri havan is the purest of all havans and shows how to achieve all forms of prosperity in life. This havan can also be used to purify a person's flaws by addressing their individual needs.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Gayatri Mantra Jaap
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [2, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 33,
  name: 'God Bharai Puja',
  image: '/images/godh-bharai.jpg',
  duration: '2 hours',
  price: 4100,
  rating: 4.8,
  reviews: 50,
  category: 'sanskar',
  occasions: ['pregnancy', 'child'],
  description: "God Bharai Puja, also known as the Indian baby shower, is a joyful ceremony to celebrate the impending arrival of a new family member and to bless the expecting mother. Held during the third trimester, this ritual is filled with music, gifts, and prayers for the health and happiness of both mother and child. The ceremony marks an important milestone in the shodasha (16) sanskaras and is believed to bring prosperity, protection, and positive energy to the family.",
  longDescription: `An Indian baby shower traditionally held in the third trimester to celebrate the impending arrival of the new member of the family and to bless the expecting mother.
Godh bharai begins with the expectant mother dressed as a bride. They have her take a seat of prominence afterwards. The pregnant woman then extends her saree's draped "palla." Guests give the expecting mother a blessing and place their gifts in her "godh," or lap. This is where the name for this practise during pregnancy comes from.
During this time, the expectant mother is showered with gifts, there is much singing and dancing, games, and special foods are prepared to make her feel special.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Rudra Puja
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'Expecting mother present',
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [1, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 34,
  name: 'Griha Pravesh',
  image: '/images/griha-pravesh.jpg',
  duration: '3 hours',
  price: 5100,
  rating: 4.9,
  reviews: 90,
  category: 'house-warming',
  occasions: ['house-warming', 'new-home'],
  description: "Griha Pravesh Puja is a traditional housewarming ceremony performed before moving into a new home. This ritual removes dosha and negative energies, protects from evil eye, and brings positive energy, peace, and prosperity to the household. It is performed when entering a new house, after renovations, or before occupying a rented home, ensuring a harmonious and blessed living environment.",
  longDescription: `Before settling into a new home, Hindus conduct a ritual called Griha Pravesh Puja. Dosh and other negative energy are banished with the help of this puja. It also increases the flow of positive energy. Household members benefit from Griha Pravesh's protective effects against natural disasters, as well as the serenity and wealth that come with living in a peaceful and prosperous home.
Dwar puja, Boiling Milk, Gauri-Ganesh, Kalash, Navgraha, Vastu puja, and a variety of havans (including Ganesh havan, Navagraha havan, Vastu havan, and Varun havan) are all part of the Griha Pravesh ritual.
The following are the times when you are required to perform Griha Pravesh:
The acquisition of a brand-new residence.
When the refurbishment of an older home is brought to a successful conclusion.
Before moving into a home that was rented.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Mool Shuddhi Havan
• Dvaar Puja & Griha Pravesh
• Kitchen Puja (Boiling Milk in new vessel)
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [1, 2, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 35,
  name: 'Gupt Navratri',
  image: '/images/gupt-navratri.jpg',
  duration: '2 hours',
  price: 5100,
  rating: 4.8,
  reviews: 55,
  category: 'devi',
  occasions: ['navratri', 'spiritual-growth'],
  description: "Gupt Navratri Puja is a powerful ritual dedicated to the worship of Dus Mahavidya, the ten wisdom goddesses. This puja is believed to fulfill material desires (bhoga) and grant spiritual emancipation (moksha). The ceremony invokes the divine feminine energy to remove obstacles, bestow wisdom, and guide the seeker toward liberation.",
  longDescription: `The Wisdom Goddesses are the ten Mahavidyas. The Brihat Dharma Purana tells the story of how the ten forms of Goddess materialized when Lord Shiva forbade Sati from participating in the Yajna that her father, Daksha Prajapati, had planned.
Sati's fury turned her into a terrifying Kali, who multiplied ten times and eventually defeated Shiva's resistance. As a result, Sati went on to participate in the sacrifice rite. To harness the Shiva within, one must realize the fundamental truths represented by each of the Devi's visible forms. They stand for many facets of divinity that aim to lead the seeker toward emancipation.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Mahavidya Mantra Pujan
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [2, 4],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 36,
  name: 'Guru Grah Shanti Puja',
  image: '/images/guru-grah-shanti.jpg',
  duration: '2 hours',
  price: 5100,
  rating: 4.7,
  reviews: 48,
  category: 'astrological',
  occasions: ['jupiter', 'remedy'],
  description: "Guru Grah Shanti Puja is performed to pacify the negative effects of Jupiter (Guru) in one's horoscope. Guru Dosha can cause problems with wealth, knowledge, finances, and education. This puja invokes the blessings of Brihaspati to remove obstacles, enhance wisdom, and bring prosperity and harmony in life.",
  longDescription: `Jupiter is the planet of learning and knowledge, also known as Guru Graha, Guru, or Brihaspati. When this planet is put in a favourable position in the horoscope, it can have astoundingly positive consequences; nonetheless, when the Guru misplaces our horoscope, it will produce issues such as money problems, training problems, medical problems, and so on. A positive Jupiter can vanquish other harmful planets. Jupiter is the ruling planet of Sagittarius and Pisces in Hindu astrology. However, when it comes to Jupiter's favoured and waning signs, they are Cancer and Capricorn, respectively. To avert negative effects, guru grah shanti havan, traditional mantras sung 19000 times, and the Shodashopachara ceremony are conducted.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Sthapana Pujan
• Guru Grah Shaanti Jaap
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [1, 2],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 37,
  name: 'Haldi Ceremony',
  image: '/images/haldi-ceremony.jpg',
  duration: '2 hours',
  price: 4100,
  rating: 4.8,
  reviews: 52,
  category: 'wedding',
  occasions: ['marriage', 'haldi'],
  description: "Haldi Ceremony is a vibrant pre-wedding ritual where turmeric paste is applied to the bride and groom. This ceremony is believed to purify the couple, ward off evil, and bring prosperity and happiness. The ritual is filled with joy, music, and blessings from family and friends, marking the beginning of the wedding festivities.",
  longDescription: `Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Haldi Pujan
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [2, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 38,
  name: 'Hanuman Chalisa Path',
  image: '/images/hanuman-chalisa.jpg',
  duration: '2 hours',
  price: 4100,
  rating: 4.9,
  reviews: 70,
  category: 'devotional',
  occasions: ['hanuman', 'protection'],
  description: "Hanuman Chalisa Path is a devotional recitation dedicated to Lord Hanuman, symbolizing faith, dedication, selflessness, and surrender. Chanting the 40 verses of Hanuman Chalisa is believed to bring strength, protection, and success, and to remove obstacles and negative influences from one's life.",
  longDescription: `Hanuman Chalisa is a well-known Hindu devotional chant devoted to Lord Hanuman. The word Hanuman refers to Lord Hanuman's name, and the word Chalisa refers to the devotional hymn's 40 verses (excluding the opening and closing verses). This devotional poem to Lord Hanuman is thought to have been penned by Tulsidas, the 16th-century poet and saint best known for penning Ramcharitmanas.
The Hanuman Chalisa Path should be followed to gain physical and mental power, protection, and success. Hanuman is Lord Shiva's incarnation. He shields his devotees from diseases, disasters, and negative planetary influences. One of the most prevalent ways to please and worship Lord Hanuman is to chant the Hanuman Chalisa.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Hanuman Chalisa Path (*11)
• Chola Sringaar Seva
• Havan Karyakram Sampannam
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Betel Nuts (Supari), Vermilion (Sindoor), Chandi Wark Sheets, Yellow Vermilion (Pila Sindoor), Chameli Oil Bottle, Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.
Havan Samagri: Havan Kund, Mango Wood, Navgrah Wood, Desi Ghee, Havan Samagri, Dry Coconut.`,
  requirements: [
    'All Puja Samagri & Havan Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [1, 4],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
{
  id: 39,
  name: 'Hartalika Teej Puja',
  image: '/images/hartalika-teej.jpg',
  duration: '2 hours',
  price: 4100,
  rating: 4.8,
  reviews: 58,
  category: 'festival',
  occasions: ['teej', 'marriage'],
  description: "Hartalika Teej Puja is performed to honor Lord Shiva and Goddess Parvati, seeking blessings for a happy married life or to find a suitable partner. Women observe nirjala (waterless) fasting and pray for the well-being and longevity of their husbands. The ritual is marked by devotion, traditional songs, and vibrant celebrations.",
  longDescription: `The word Hartalika is a combination of the two words Harat and Aalika, which mean to kidnap a friend. Lord Shiva is said to have decided to marry Goddess Parvati on this day after 108 incarnations. As a result, it is regarded as one of the most auspicious occasions for a good marriage.
Single women desperately want to find a wonderful partner. This auspicious day is observed by newly married women wearing new attire, particularly green sarees, and visiting their parents' homes. They also do innovative swings and sing traditional songs about Lord Shiva and Goddess Parvati's love. Teej is also known as Teej Mata on this day since it commemorates the marriage of God Shiva and Goddess Parvati. Women pray for a happy marriage and the happiness of their family on this auspicious day.
Book online Pandit for Puja & Havan services with PujaKaro.in including all puja & havan samagri materials, at the cheapest price. Enjoy hassle free experience and attain spiritual & ritual divinity.

Puja Vidhi:
• Swasti Vachnam
• Shodasha Upachara Puja
• Maha Sankalpam
• Gauri Ganesh Puja
• Kalash & Navgrah Puja
• Punyaha Vachnam
• Hartalika Teej Vrat Katha & Abhishek
• Aarti & Prasad Vitaran

Puja Samagri: Haldi, Kumkum, Akshata, Paan Patta, Chameli Oil Bottle, Chandi Wark Sheets, Betel Nuts (Supari), Desi Ghee, Mouli, Jaggery (Gud), Yagno-Paveetham (Janeu), Camphor (Kapur), Panchmeva, Red & White Cloth, Laung & Elaichi, Misri, Sandalwood Powder (Chandan Powder), Ashtagandha Powder, Honey, Ganga Jal, Dhoop, Yellow Mustard (Yellow Sarso), Black Sesame (Kaala Til), Durva Ghaas, Itra, Diya-Baati, Utensils, Dona (Disposable Bowl), Flowers Mala, Tulsi Leaves, Mango Leaves, Coconut, Curd, Milk, Mithaai, Fruits, Kalash, Chowki, Aasan.`,
  requirements: [
    'All Puja Samagri included',
    'Clean site for puja setup'
  ],
  pandits: [2, 3],
  availableTimeSlots: [
    'Morning (6 AM - 8 AM)',
    'Late Morning (8 AM - 10 AM)',
    'Afternoon (12 PM - 2 PM)'
  ]
},
  ]
  
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