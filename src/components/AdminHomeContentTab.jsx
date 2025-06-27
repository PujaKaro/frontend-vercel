import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faPlus, faSave, faTrash, faInfo, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';

const AdminHomeContentTab = () => {
  // State for all home page content
  const [heroStats, setHeroStats] = useState({
    pujasToday: "238",
    happyDevotees: "1,500+",
    expertPandits: "50+"
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    icon: '🪔',
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  });

  // Services section content
  const [servicesContent, setServicesContent] = useState({
    heading: "Our Services",
    subheading: "Experience the divine through our comprehensive spiritual services",
    services: [
      {
        image: "images/puja_booking.svg",
        title: "Puja Booking",
        description: "Book authentic pujas performed by verified pandits",
        link: "/puja-booking",
        buttonText: "Book Now"
      },
      {
        image: "images/flower.svg",
        title: "Flowers & Mala",
        description: "Fresh flowers and garlands delivered to your doorstep",
        link: "/flowers-and-mala",
        buttonText: "Subscribe Now"
      },
      {
        image: "images/prashad.svg",
        title: "Prashad Services",
        description: "Sacred Prasad offerings prepared with pure devotion",
        link: "/prashad-services",
        buttonText: "Subscribe Now"
      }
    ]
  });

  // Why Choose Us section content
  const [whyChooseUsContent, setWhyChooseUsContent] = useState({
    heading: "Why Choose PujaKaro",
    subheading: "Your one-stop destination for all puja needs, offering an unmatched spiritual experience",
    features: [
      {
        icon: "🕉️",
        title: "Expert Pandits",
        description: "Experienced and knowledgeable pandits who perform authentic rituals with precision"
      },
      {
        icon: "🛍️",
        title: "Complete Samagri",
        description: "Premium quality puja materials sourced directly from religious suppliers"
      },
      {
        icon: "🏠",
        title: "Beautiful Decor",
        description: "Elegant and traditional decorations to create a divine ambience for your ceremony"
      },
      {
        icon: "🔥",
        title: "All Essentials",
        description: "Hawan kund, kalash, and all other ritual necessities provided with care"
      },
      {
        icon: "✅",
        title: "One Booking",
        description: "We handle everything from start to finish - just relax and focus on the spiritual experience"
      },
      {
        icon: "📍",
        title: "Multiple Locations",
        description: "Choose from temple, home, online or yamuna ghat for your puja ceremony"
      }
    ]
  });

  // Featured Puja section content
  const [featuredPujaContent, setFeaturedPujaContent] = useState({
    heading: "Featured Puja",
    pujaName: "Satyanarayan Puja",
    description: "Experience the divine blessings of Lord Vishnu through this auspicious puja performed by our expert pandits. This sacred ceremony brings prosperity and peace to your home.",
    price: "₹5,100",
    nextAvailable: "Tomorrow",
    duration: "2 hours",
    image: "/images/featuredPuja.jpg"
  });

  // Testimonial section content
  const [testimonialContent, setTestimonialContent] = useState({
    heading: "What Our Devotees Say",
    subheading: "Hear from people who have experienced the divine journey with us"
  });

  // Icons for selection
  const availableIcons = ['🪔', '🙏', '✨', '💫', '🕉️', '🔥', '🌺', '🌟', '🏮', '🔔', '🛍️', '🏠', '✅', '📍'];
  
  // Color schemes for events
  const colorSchemes = [
    { id: 'amber', value: 'bg-amber-100 text-amber-800 border-amber-200', display: 'Amber' },
    { id: 'orange', value: 'bg-orange-100 text-orange-800 border-orange-200', display: 'Orange' },
    { id: 'rose', value: 'bg-rose-100 text-rose-800 border-rose-200', display: 'Rose' },
    { id: 'yellow', value: 'bg-yellow-100 text-yellow-800 border-yellow-200', display: 'Yellow' },
    { id: 'green', value: 'bg-green-100 text-green-800 border-green-200', display: 'Green' },
    { id: 'blue', value: 'bg-blue-100 text-blue-800 border-blue-200', display: 'Blue' },
    { id: 'purple', value: 'bg-purple-100 text-purple-800 border-purple-200', display: 'Purple' },
  ];

  // Hero section content
  const [heroContent, setHeroContent] = useState({
    headline: "Connect with Divine through PujaKaro",
    description: "Your trusted platform for authentic puja services, religious products, and spiritual guidance",
    primaryButton: {
      text: "Book a Puja",
      link: "/puja-booking"
    },
    secondaryButton: {
      text: "Shop Now",
      link: "/shop"
    }
  });

  // Home page layout configuration
  const [homeLayout, setHomeLayout] = useState({
    sections: [
      { id: 'hero', name: 'Hero Section', enabled: true, order: 1 },
      { id: 'promotionalBanner', name: 'Promotional Banner', enabled: true, order: 2 },
      { id: 'statistics', name: 'Statistics', enabled: true, order: 3 },
      { id: 'upcomingDates', name: 'Upcoming Dates', enabled: true, order: 4 },
      { id: 'services', name: 'Services', enabled: true, order: 5 },
      { id: 'whyChooseUs', name: 'Why Choose Us', enabled: true, order: 6 },
      { id: 'featuredPuja', name: 'Featured Puja', enabled: true, order: 7 },
      { id: 'productsSection', name: 'Products Section', enabled: true, order: 8 },
      { id: 'testimonialSection', name: 'Testimonials', enabled: true, order: 9 },
      { id: 'panditSection', name: 'Pandit Section', enabled: true, order: 10 }
    ]
  });

  // Promotional Banner content
  const [promotionalBanner, setPromotionalBanner] = useState({
    banners: [
      {
        icon: "✨",
        title: "Your One-Stop Destination for All Puja Needs!",
        highlights: ["Experienced Pandit Ji", "Puja Samagri (complete)", "Home Decor", "Ritual Essentials"],
        cta: "Book Now with Pujakaro.in • Call/WhatsApp: 8800627513"
      },
      {
        icon: "🛕",
        title: "Where would you like your Puja?",
        highlights: ["At Kalka Ji Temple", "At Your Home", "Online Puja", "At Yamuna Ghat"],
        cta: "Complete Puja Services at Your Chosen Location"
      },
      {
        icon: "🔥",
        title: "Everything You Need for a Perfect Puja — Hassle-Free!",
        highlights: ["Expert Pandit Ji ", "Complete Puja Samagri", "Beautiful Home Decor", "All Ritual Essentials"],
        cta: "One Booking — We Handle Everything!"
      }
    ]
  });

  // Available icons for promotional banners
  const availableBannerIcons = ['✨', '🛕', '🔥', '🪔', '🙏', '💫', '🌟', '🏮', '🔔', '🕉️'];

  // Available sections for home page layout
  const availableSections = [
    { id: 'heroSection', name: 'Hero Section' },
    { id: 'promotionalBanner', name: 'Promotional Banner' },
    { id: 'statistics', name: 'Statistics' },
    { id: 'services', name: 'Services' },
    { id: 'whyChooseUs', name: 'Why Choose Us' },
    { id: 'featuredPuja', name: 'Featured Puja' },
    { id: 'testimonials', name: 'Testimonials' },
    { id: 'upcomingDates', name: 'Upcoming Dates' }
  ];

  // Load data from Firestore
  const fetchHomePageContent = async () => {
    try {
      // Fetch hero stats
      const statsDoc = await getDoc(doc(db, 'siteContent', 'heroStats'));
      if (statsDoc.exists()) {
        setHeroStats(statsDoc.data());
      }
      
      // Fetch hero section content
      const heroDoc = await getDoc(doc(db, 'siteContent', 'heroSection'));
      if (heroDoc.exists()) {
        setHeroContent(heroDoc.data());
      }
      
      // Fetch promotional banner content
      const bannerDoc = await getDoc(doc(db, 'siteContent', 'promotionalBanner'));
      if (bannerDoc.exists()) {
        setPromotionalBanner(bannerDoc.data());
      }
      
      // Fetch home layout configuration
      const layoutDoc = await getDoc(doc(db, 'siteContent', 'homeLayout'));
      if (layoutDoc.exists()) {
        setHomeLayout(layoutDoc.data());
      }
      
      // Fetch upcoming events
      const eventsSnapshot = await getDocs(collection(db, 'auspiciousDates'));
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure date is in ISO format for the input field
        date: doc.data().date ? new Date(doc.data().date.seconds * 1000).toISOString().split('T')[0] : ''
      }));
      
      // Sort events by date
      eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setUpcomingEvents(eventsData);

      // Fetch services content
      const servicesDoc = await getDoc(doc(db, 'siteContent', 'services'));
      if (servicesDoc.exists()) {
        setServicesContent(servicesDoc.data());
      }

      // Fetch why choose us content
      const whyChooseUsDoc = await getDoc(doc(db, 'siteContent', 'whyChooseUs'));
      if (whyChooseUsDoc.exists()) {
        setWhyChooseUsContent(whyChooseUsDoc.data());
      }

      // Fetch featured puja content
      const featuredPujaDoc = await getDoc(doc(db, 'siteContent', 'featuredPuja'));
      if (featuredPujaDoc.exists()) {
        setFeaturedPujaContent(featuredPujaDoc.data());
      }

      // Fetch testimonial content
      const testimonialDoc = await getDoc(doc(db, 'siteContent', 'testimonials'));
      if (testimonialDoc.exists()) {
        setTestimonialContent(testimonialDoc.data());
      }

    } catch (error) {
      console.error('Error fetching home page content:', error);
      toast.error('Failed to load home page content');
    }
  };

  // Save functions for each section
  const saveHeroStats = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'heroStats'), heroStats);
      toast.success('Hero statistics updated successfully');
    } catch (error) {
      console.error('Error saving hero stats:', error);
      toast.error('Failed to save hero statistics');
    }
  };

  const saveServicesContent = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'services'), servicesContent);
      toast.success('Services content updated successfully');
    } catch (error) {
      console.error('Error saving services content:', error);
      toast.error('Failed to save services content');
    }
  };

  const saveWhyChooseUsContent = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'whyChooseUs'), whyChooseUsContent);
      toast.success('Why Choose Us content updated successfully');
    } catch (error) {
      console.error('Error saving why choose us content:', error);
      toast.error('Failed to save why choose us content');
    }
  };

  const saveFeaturedPujaContent = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'featuredPuja'), featuredPujaContent);
      toast.success('Featured Puja content updated successfully');
    } catch (error) {
      console.error('Error saving featured puja content:', error);
      toast.error('Failed to save featured puja content');
    }
  };

  const saveTestimonialContent = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'testimonials'), testimonialContent);
      toast.success('Testimonial content updated successfully');
    } catch (error) {
      console.error('Error saving testimonial content:', error);
      toast.error('Failed to save testimonial content');
    }
  };

  // Save hero section content
  const saveHeroContent = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'heroSection'), heroContent);
      toast.success('Hero section content updated successfully');
    } catch (error) {
      console.error('Error saving hero content:', error);
      toast.error('Failed to save hero section content');
    }
  };

  // Save home layout configuration
  const saveHomeLayout = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'homeLayout'), homeLayout);
      toast.success('Home page layout updated successfully');
    } catch (error) {
      console.error('Error saving home layout:', error);
      toast.error('Failed to save home page layout');
    }
  };

  // Save promotional banner content
  const savePromotionalBanner = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'promotionalBanner'), promotionalBanner);
      toast.success('Promotional banner content updated successfully');
    } catch (error) {
      console.error('Error saving promotional banner:', error);
      toast.error('Failed to save promotional banner content');
    }
  };

  // Add new event
  const addEvent = async () => {
    try {
      if (!newEvent.name || !newEvent.date) {
        toast.error('Please enter both name and date');
        return;
      }

      const eventDate = new Date(newEvent.date);
      const eventsRef = collection(db, 'auspiciousDates');
      const eventData = {
        name: newEvent.name,
        date: eventDate,
        icon: newEvent.icon,
        color: newEvent.color,
        createdAt: new Date()
      };
      
      const docRef = await setDoc(doc(eventsRef), eventData);
      
      setUpcomingEvents([
        ...upcomingEvents, 
        { 
          id: docRef ? docRef.id : `temp-${Date.now()}`,
          ...eventData,
          date: newEvent.date
        }
      ]);
      
      setNewEvent({
        name: '',
        date: '',
        icon: '🪔',
        color: 'bg-amber-100 text-amber-800 border-amber-200'
      });
      
      toast.success('Event added successfully');
      fetchHomePageContent();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'auspiciousDates', eventId));
      setUpcomingEvents(upcomingEvents.filter(event => event.id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  // Handle input changes
  const handleStatsChange = (e) => {
    const { name, value } = e.target;
    setHeroStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicesChange = (e) => {
    const { name, value } = e.target;
    setServicesContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWhyChooseUsChange = (e) => {
    const { name, value } = e.target;
    setWhyChooseUsContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeaturedPujaChange = (e) => {
    const { name, value } = e.target;
    setFeaturedPujaContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestimonialChange = (e) => {
    const { name, value } = e.target;
    setTestimonialContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update service item
  const updateService = (index, field, value) => {
    const updatedServices = [...servicesContent.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServicesContent(prev => ({
      ...prev,
      services: updatedServices
    }));
  };

  // Update feature item
  const updateFeature = (index, field, value) => {
    const updatedFeatures = [...whyChooseUsContent.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setWhyChooseUsContent(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // Handle input changes for hero content
  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setHeroContent(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setHeroContent(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle layout changes
  const handleLayoutChange = (sectionId, field, value) => {
    setHomeLayout(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, [field]: value }
          : section
      )
    }));
  };

  // Reorder sections
  const moveSection = (sectionId, direction) => {
    setHomeLayout(prev => {
      const sections = [...prev.sections];
      const currentIndex = sections.findIndex(s => s.id === sectionId);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex >= 0 && newIndex < sections.length) {
        [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];
        sections[currentIndex].order = currentIndex + 1;
        sections[newIndex].order = newIndex + 1;
      }
      
      return { ...prev, sections };
    });
  };

  // Handle promotional banner changes
  const handleBannerChange = (bannerIndex, field, value) => {
    setPromotionalBanner(prev => ({
      ...prev,
      banners: prev.banners.map((banner, index) => 
        index === bannerIndex 
          ? { ...banner, [field]: value }
          : banner
      )
    }));
  };

  // Handle banner highlights changes
  const handleBannerHighlightChange = (bannerIndex, highlightIndex, value) => {
    setPromotionalBanner(prev => ({
      ...prev,
      banners: prev.banners.map((banner, index) => 
        index === bannerIndex 
          ? {
              ...banner,
              highlights: banner.highlights.map((highlight, hIndex) => 
                hIndex === highlightIndex ? value : highlight
              )
            }
          : banner
      )
    }));
  };

  // Update all highlights for a banner
  const handleBannerHighlightsChange = (bannerIndex, highlightsText) => {
    const highlights = highlightsText.split(',').map(h => h.trim()).filter(h => h);
    setPromotionalBanner(prev => ({
      ...prev,
      banners: prev.banners.map((banner, index) => 
        index === bannerIndex 
          ? { ...banner, highlights }
          : banner
      )
    }));
  };

  // Add new banner
  const addBanner = () => {
    setPromotionalBanner(prev => ({
      ...prev,
      banners: [
        ...prev.banners,
        {
          icon: "✨",
          title: "New Promotional Banner",
          highlights: ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"],
          cta: "Call to action text"
        }
      ]
    }));
  };

  // Remove banner
  const removeBanner = (bannerIndex) => {
    if (promotionalBanner.banners.length > 1) {
      setPromotionalBanner(prev => ({
        ...prev,
        banners: prev.banners.filter((_, index) => index !== bannerIndex)
      }));
    } else {
      toast.error('At least one banner is required');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchHomePageContent();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section Content */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Hero Section Content</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headline
              </label>
              <input
                type="text"
                name="headline"
                value={heroContent.headline}
                onChange={handleHeroChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter hero headline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={heroContent.description}
                onChange={handleHeroChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter hero description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Button Text
              </label>
              <input
                type="text"
                name="primaryButton.text"
                value={heroContent.primaryButton.text}
                onChange={handleHeroChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Primary button text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Button Link
              </label>
              <input
                type="text"
                name="primaryButton.link"
                value={heroContent.primaryButton.link}
                onChange={handleHeroChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="/puja-booking"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Button Text
              </label>
              <input
                type="text"
                name="secondaryButton.text"
                value={heroContent.secondaryButton.text}
                onChange={handleHeroChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Secondary button text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Button Link
              </label>
              <input
                type="text"
                name="secondaryButton.link"
                value={heroContent.secondaryButton.link}
                onChange={handleHeroChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="/shop"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={saveHeroContent}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save Hero Content
            </button>
          </div>
        </div>
      </div>

      {/* Home Page Layout Configuration */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Home Page Layout Configuration</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            {homeLayout.sections.map((section, index) => (
              <div key={section.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{section.name}</span>
                    <span className="text-sm text-gray-500">Order: {section.order}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={(e) => handleLayoutChange(section.id, 'enabled', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === homeLayout.sections.length - 1}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={saveHomeLayout}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save Layout Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Hero Statistics Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon icon={faInfo} className="mr-2 text-blue-500" />
          Hero Section Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pujas Today Count
            </label>
            <input
              type="text"
              name="pujasToday"
              value={heroStats.pujasToday}
              onChange={handleStatsChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Happy Devotees Count
            </label>
            <input
              type="text"
              name="happyDevotees"
              value={heroStats.happyDevotees}
              onChange={handleStatsChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expert Pandits Count
            </label>
            <input
              type="text"
              name="expertPandits"
              value={heroStats.expertPandits}
              onChange={handleStatsChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={saveHeroStats}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Hero Statistics
        </button>
      </div>

      {/* Services Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon icon={faEdit} className="mr-2 text-green-500" />
          Services Section
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Heading
            </label>
            <input
              type="text"
              name="heading"
              value={servicesContent.heading}
              onChange={handleServicesChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Subheading
            </label>
            <input
              type="text"
              name="subheading"
              value={servicesContent.subheading}
              onChange={handleServicesChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Service Items</h3>
        <div className="space-y-4">
          {servicesContent.services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title
                  </label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(index, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Path
                  </label>
                  <input
                    type="text"
                    value={service.image}
                    onChange={(e) => updateService(index, 'image', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    rows="2"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link
                  </label>
                  <input
                    type="text"
                    value={service.link}
                    onChange={(e) => updateService(index, 'link', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={service.buttonText}
                    onChange={(e) => updateService(index, 'buttonText', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={saveServicesContent}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Services Content
        </button>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon icon={faEdit} className="mr-2 text-purple-500" />
          Why Choose Us Section
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Heading
            </label>
            <input
              type="text"
              name="heading"
              value={whyChooseUsContent.heading}
              onChange={handleWhyChooseUsChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Subheading
            </label>
            <input
              type="text"
              name="subheading"
              value={whyChooseUsContent.subheading}
              onChange={handleWhyChooseUsChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Features</h3>
        <div className="space-y-4">
          {whyChooseUsContent.features.map((feature, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <select
                    value={feature.icon}
                    onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {availableIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={feature.description}
                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                    rows="2"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={saveWhyChooseUsContent}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Why Choose Us Content
        </button>
      </div>

      {/* Featured Puja Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon icon={faEdit} className="mr-2 text-orange-500" />
          Featured Puja Section
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Heading
            </label>
            <input
              type="text"
              name="heading"
              value={featuredPujaContent.heading}
              onChange={handleFeaturedPujaChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puja Name
            </label>
            <input
              type="text"
              name="pujaName"
              value={featuredPujaContent.pujaName}
              onChange={handleFeaturedPujaChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={featuredPujaContent.description}
              onChange={handleFeaturedPujaChange}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="text"
              name="price"
              value={featuredPujaContent.price}
              onChange={handleFeaturedPujaChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Available
            </label>
            <input
              type="text"
              name="nextAvailable"
              value={featuredPujaContent.nextAvailable}
              onChange={handleFeaturedPujaChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={featuredPujaContent.duration}
              onChange={handleFeaturedPujaChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Path
            </label>
            <input
              type="text"
              name="image"
              value={featuredPujaContent.image}
              onChange={handleFeaturedPujaChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <button
          onClick={saveFeaturedPujaContent}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Featured Puja Content
        </button>
      </div>

      {/* Testimonial Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon icon={faEdit} className="mr-2 text-indigo-500" />
          Testimonial Section
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Heading
            </label>
            <input
              type="text"
              name="heading"
              value={testimonialContent.heading}
              onChange={handleTestimonialChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Subheading
            </label>
            <input
              type="text"
              name="subheading"
              value={testimonialContent.subheading}
              onChange={handleTestimonialChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <button
          onClick={saveTestimonialContent}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Save Testimonial Content
        </button>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon icon={faCalendarDay} className="mr-2 text-red-500" />
          Upcoming Auspicious Dates
        </h2>
        
        {/* Add new event form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <input
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleEventChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Satyanarayan Puja"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleEventChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <select
                name="icon"
                value={newEvent.icon}
                onChange={handleEventChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {availableIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Scheme
              </label>
              <select
                name="color"
                value={newEvent.color}
                onChange={handleEventChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {colorSchemes.map(scheme => (
                  <option key={scheme.id} value={scheme.value}>{scheme.display}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={addEvent}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Event
          </button>
        </div>

        {/* Existing events */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-4">Existing Events</h3>
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{event.icon}</span>
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
              </div>
              <button
                onClick={() => deleteEvent(event.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banner Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon icon={faEdit} className="mr-2 text-teal-500" />
          Promotional Banner Section
        </h2>
        
        <div className="space-y-6">
          {promotionalBanner.banners.map((banner, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Banner {index + 1}</h3>
                <button
                  onClick={() => removeBanner(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  disabled={promotionalBanner.banners.length === 1}
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <select
                    value={banner.icon}
                    onChange={(e) => handleBannerChange(index, 'icon', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {availableBannerIcons.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highlights (comma-separated)
                  </label>
                  <textarea
                    value={banner.highlights.join(', ')}
                    onChange={(e) => handleBannerHighlightsChange(index, e.target.value)}
                    rows="2"
                    placeholder="Enter highlights separated by commas"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call to Action Text
                  </label>
                  <input
                    type="text"
                    value={banner.cta}
                    onChange={(e) => handleBannerChange(index, 'cta', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex gap-4">
          <button
            onClick={addBanner}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Banner
          </button>
          
          <button
            onClick={savePromotionalBanner}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save Promotional Banner Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeContentTab; 