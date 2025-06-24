import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faPlus, faSave, faTrash, faInfo } from '@fortawesome/free-solid-svg-icons';

const AdminHomeContentTab = () => {
  // State for statistics in the hero section
  const [heroStats, setHeroStats] = useState({
    pujasToday: "238",
    happyDevotees: "1,500+",
    expertPandits: "50+"
  });

  // State for upcoming events/pujas
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    icon: '🪔',
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  });

  // Icons for selection
  const availableIcons = ['🪔', '🙏', '✨', '💫', '🕉️', '🔥', '🌺', '🌟', '🏮', '🔔'];
  
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

  // Load data from Firestore
  const fetchHomePageContent = async () => {
    try {
      // Fetch hero stats
      const statsDoc = await getDoc(doc(db, 'siteContent', 'heroStats'));
      if (statsDoc.exists()) {
        setHeroStats(statsDoc.data());
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
    } catch (error) {
      console.error('Error fetching home page content:', error);
      toast.error('Failed to load home page content');
    }
  };

  // Save hero statistics
  const saveHeroStats = async () => {
    try {
      await setDoc(doc(db, 'siteContent', 'heroStats'), heroStats);
      toast.success('Hero statistics updated successfully');
    } catch (error) {
      console.error('Error saving hero stats:', error);
      toast.error('Failed to save hero statistics');
    }
  };

  // Add new event
  const addEvent = async () => {
    try {
      if (!newEvent.name || !newEvent.date) {
        toast.error('Please enter both name and date');
        return;
      }

      // Convert string date to Firestore timestamp
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
      
      // Add to local state with id
      setUpcomingEvents([
        ...upcomingEvents, 
        { 
          id: docRef ? docRef.id : `temp-${Date.now()}`,
          ...eventData,
          date: newEvent.date // Keep the string format for the form
        }
      ]);
      
      // Clear form
      setNewEvent({
        name: '',
        date: '',
        icon: '🪔',
        color: 'bg-amber-100 text-amber-800 border-amber-200'
      });
      
      toast.success('Event added successfully');
      
      // Refresh data
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
      
      // Update local state
      setUpcomingEvents(upcomingEvents.filter(event => event.id !== eventId));
      
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  // Handle input changes for hero stats
  const handleStatsChange = (e) => {
    const { name, value } = e.target;
    setHeroStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for new event
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Load data on component mount
  useEffect(() => {
    fetchHomePageContent();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Hero Section Statistics</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
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
              <p className="text-sm text-gray-500 mt-1">
                Shown as the "Pujas Today" stat in the hero section
              </p>
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
              <p className="text-sm text-gray-500 mt-1">
                Shown as the "Happy Devotees" stat in the hero section
              </p>
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
              <p className="text-sm text-gray-500 mt-1">
                Shown as the "Expert Pandits" stat in the hero section
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-right">
            <button
              onClick={saveHeroStats}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save Statistics
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Auspicious Dates</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h3 className="font-semibold text-lg mb-4">Add New Event</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <input
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleEventChange}
                placeholder="e.g., Ganesh Chaturthi"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
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
              <div className="flex flex-wrap gap-2">
                {availableIcons.map((icon, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, icon })}
                    className={`w-8 h-8 flex items-center justify-center text-lg rounded ${
                      newEvent.icon === icon 
                        ? 'bg-orange-100 border-2 border-orange-500' 
                        : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
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
                  <option key={scheme.id} value={scheme.value}>
                    {scheme.display}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={addEvent}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Event
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingEvents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    <FontAwesomeIcon icon={faInfo} className="mr-2" />
                    No events found. Add your first event above.
                  </td>
                </tr>
              ) : (
                upcomingEvents.map((event, index) => (
                  <tr key={event.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-xl">
                      {event.icon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`px-3 py-1.5 inline-block rounded-full ${event.color}`}>
                        {colorSchemes.find(scheme => scheme.value === event.color)?.display || 'Custom'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeContentTab; 