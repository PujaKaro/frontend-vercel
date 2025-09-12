import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog, 
  faHome, 
  faBook, 
  faGift, 
  faFire, 
  faLightbulb,
  faClock,
  faCheckCircle,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

const PujaTimeline = ({ timeline = [] }) => {
  const [expandedSteps, setExpandedSteps] = useState({});

  if (!timeline || timeline.length === 0) {
    return null;
  }

  const toggleStep = (index) => {
    setExpandedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getIcon = (iconName) => {
    const iconMap = {
      'settings': faCog,
      'home': faHome,
      'auto_stories': faBook,
      'celebration': faGift,
      'local_fire_department': faFire,
      'lightbulb': faLightbulb,
      'clock': faClock,
      'check': faCheckCircle
    };
    return iconMap[iconName] || faCog;
  };

  const getColorClasses = (color) => {
    const colorMap = {
      'blue': 'bg-blue-100 text-blue-600 border-blue-200',
      'green': 'bg-green-100 text-green-600 border-green-200',
      'orange': 'bg-orange-100 text-orange-600 border-orange-200',
      'purple': 'bg-purple-100 text-purple-600 border-purple-200',
      'red': 'bg-red-100 text-red-600 border-red-200',
      'yellow': 'bg-yellow-100 text-yellow-600 border-yellow-200',
      'teal': 'bg-teal-100 text-teal-600 border-teal-200',
      'indigo': 'bg-indigo-100 text-indigo-600 border-indigo-200',
      'pink': 'bg-pink-100 text-pink-600 border-pink-200',
      'gray': 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colorMap[color] || 'bg-blue-100 text-blue-600 border-blue-200';
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
        <FontAwesomeIcon icon={faClock} className="mr-2 text-orange-500" />
        Puja Timeline
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({timeline.length} steps)
        </span>
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-300 to-orange-200"></div>
        
        <div className="space-y-6">
          {timeline.map((step, index) => (
            <div key={index} className="relative flex items-start">
              {/* Timeline dot */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getColorClasses(step.color)}`}>
                <FontAwesomeIcon 
                  icon={getIcon(step.icon)} 
                  className="text-lg" 
                />
              </div>
              
              {/* Content */}
              <div className="ml-6 flex-1">
                <div 
                  onClick={() => toggleStep(index)}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h4>
                    {step.duration && (
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getColorClasses(step.color)}`}>
                        <span>{step.duration}</span>
                        <FontAwesomeIcon 
                          icon={expandedSteps[index] ? faChevronUp : faChevronDown} 
                          className="text-xs transition-transform duration-200"
                        />
                      </div>
                    )}
                  </div>
                  
                  {expandedSteps[index] && (
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                  
                  {/* Step number */}
                  {/* <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      Step {index + 1} of {timeline.length}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Total duration summary */}
      <div className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="text-orange-500 mr-2" />
            <span className="font-semibold text-gray-900">Total Duration</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {timeline.reduce((total, step) => {
                const duration = step.duration;
                if (duration.includes('Hour')) {
                  return total + parseInt(duration) * 60;
                } else if (duration.includes('mins')) {
                  return total + parseInt(duration);
                }
                return total;
              }, 0)} minutes
            </div>
            <div className="text-sm text-gray-600">
              Complete ceremony timeline
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PujaTimeline;
