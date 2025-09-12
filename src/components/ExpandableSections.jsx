import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronUp, 
  faBook, 
  faLightbulb,
  faInfoCircle,
  faHeart,
  faStar
} from '@fortawesome/free-solid-svg-icons';

const ExpandableSections = ({ sections = [] }) => {
  const [expandedSections, setExpandedSections] = useState({});

  if (!sections || sections.length === 0) {
    return null;
  }

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getSectionIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('legend') || titleLower.includes('fable')) {
      return faBook;
    } else if (titleLower.includes('philosophy') || titleLower.includes('philosophical')) {
      return faLightbulb;
    } else if (titleLower.includes('vidhi') || titleLower.includes('procedure')) {
      return faInfoCircle;
    } else if (titleLower.includes('samagri') || titleLower.includes('materials')) {
      return faStar;
    } else if (titleLower.includes('cultural') || titleLower.includes('acceptance')) {
      return faHeart;
    }
    return faInfoCircle;
  };

  const getSectionColor = (index) => {
    const colors = [
      'border-blue-200 bg-blue-50 text-blue-800',
      'border-green-200 bg-green-50 text-green-800',
      'border-purple-200 bg-purple-50 text-purple-800',
      'border-orange-200 bg-orange-50 text-orange-800',
      'border-pink-200 bg-pink-50 text-pink-800',
      'border-teal-200 bg-teal-50 text-teal-800',
      'border-indigo-200 bg-indigo-50 text-indigo-800',
      'border-red-200 bg-red-50 text-red-800'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
        <FontAwesomeIcon icon={faBook} className="mr-2 text-orange-500" />
        Learn More About This Puja
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({sections.length} sections)
        </span>
      </h3>
      
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className={`border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md ${
              expandedSections[index] 
                ? 'shadow-lg' 
                : 'shadow-sm'
            }`}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(index)}
              className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors duration-200 ${getSectionColor(index)}`}
            >
              <div className="flex items-center">
                <FontAwesomeIcon 
                  icon={getSectionIcon(section.title)} 
                  className="mr-3 text-lg" 
                />
                <h4 className="text-lg font-semibold">
                  {section.title}
                </h4>
              </div>
              
              <FontAwesomeIcon 
                icon={expandedSections[index] ? faChevronUp : faChevronDown} 
                className="text-lg transition-transform duration-200"
              />
            </button>
            
            {/* Section Content */}
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                expandedSections[index] 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick expand/collapse all */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            const allExpanded = Object.values(expandedSections).every(Boolean);
            const newState = {};
            sections.forEach((_, index) => {
              newState[index] = !allExpanded;
            });
            setExpandedSections(newState);
          }}
          className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors duration-200"
        >
          {Object.values(expandedSections).every(Boolean) ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
    </div>
  );
};

export default ExpandableSections;
