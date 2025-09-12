import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faCrown, 
  faStar, 
  faGem,
  faClock,
  faUsers,
  faCamera,
  faVideo,
  faWifi
} from '@fortawesome/free-solid-svg-icons';

const ServiceTierSelector = ({ serviceTiers, selectedTier, selectedOption, onTierChange, onOptionChange }) => {
  const [expandedTier, setExpandedTier] = useState(selectedTier || 'basic');

  const getTierIcon = (tierKey) => {
    const iconMap = {
      'basic': faCheck,
      'premium': faStar,
      'deluxe': faCrown
    };
    return iconMap[tierKey] || faCheck;
  };

  const getTierColor = (tierKey) => {
    const colorMap = {
      'basic': 'border-gray-300 bg-gray-50 text-gray-700',
      'premium': 'border-blue-300 bg-blue-50 text-blue-700',
      'deluxe': 'border-purple-300 bg-purple-50 text-purple-700'
    };
    return colorMap[tierKey] || 'border-gray-300 bg-gray-50 text-gray-700';
  };

  const getTierAccentColor = (tierKey) => {
    const colorMap = {
      'basic': 'text-gray-600',
      'premium': 'text-blue-600',
      'deluxe': 'text-purple-600'
    };
    return colorMap[tierKey] || 'text-gray-600';
  };

  const getFeatureIcon = (feature) => {
    if (feature.toLowerCase().includes('pandit') || feature.toLowerCase().includes('priest')) {
      return faUsers;
    } else if (feature.toLowerCase().includes('duration') || feature.toLowerCase().includes('hour')) {
      return faClock;
    } else if (feature.toLowerCase().includes('photography') || feature.toLowerCase().includes('photo')) {
      return faCamera;
    } else if (feature.toLowerCase().includes('video') || feature.toLowerCase().includes('recording')) {
      return faVideo;
    } else if (feature.toLowerCase().includes('streaming') || feature.toLowerCase().includes('live')) {
      return faWifi;
    } else if (feature.toLowerCase().includes('gold') || feature.toLowerCase().includes('royal')) {
      return faGem;
    }
    return faCheck;
  };

  if (!serviceTiers) {
    return null;
  }

  const tiers = Object.entries(serviceTiers);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
        <FontAwesomeIcon icon={faCrown} className="mr-2 text-orange-500" />
        Choose Your Service Tier
      </h3>
      
      <div className="space-y-6">
        {tiers.map(([tierKey, tier]) => (
          <div key={tierKey} className="border rounded-xl overflow-hidden">
            {/* Tier Header */}
            <div 
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                expandedTier === tierKey 
                  ? `${getTierColor(tierKey)} shadow-lg` 
                  : `${getTierColor(tierKey)} hover:shadow-sm`
              }`}
              onClick={() => setExpandedTier(expandedTier === tierKey ? null : tierKey)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon 
                    icon={getTierIcon(tierKey)} 
                    className={`text-xl ${getTierAccentColor(tierKey)}`}
                  />
                  <div>
                    <h4 className="text-lg font-semibold">{tier.name}</h4>
                    <p className="text-sm opacity-75">{tier.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">{tier.price.toLocaleString()}</div>
                  <div className="text-sm opacity-75">Starting from</div>
                </div>
              </div>
            </div>

            {/* Tier Options */}
            {expandedTier === tierKey && (
              <div className="p-4 bg-white border-t">
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">What's Included:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <FontAwesomeIcon 
                          icon={getFeatureIcon(feature)} 
                          className={`text-xs ${getTierAccentColor(tierKey)}`}
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-700">Available Options:</h5>
                  {tier.options.map((option) => (
                    <div 
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedTier === tierKey && selectedOption === option.id
                          ? 'border-orange-500 bg-orange-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => {
                        onTierChange(tierKey);
                        onOptionChange(option.id);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h6 className="font-semibold text-gray-900">{option.name}</h6>
                            {selectedTier === tierKey && selectedOption === option.id && (
                              <FontAwesomeIcon icon={faCheck} className="text-green-500 text-sm" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faClock} className="text-xs" />
                              <span>{option.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faUsers} className="text-xs" />
                              <span>{option.pandits} Pandit{option.pandits > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faGem} className="text-xs" />
                              <span>₹{option.price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faCheck} className="text-xs" />
                              <span>{option.features.length} Features</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4 text-right">
                          <div className="text-xl font-bold text-gray-900">
                            ₹{option.price.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Total Price</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Service Summary */}
      {selectedTier && selectedOption && (
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
          <h5 className="font-semibold text-gray-900 mb-2">Selected Service:</h5>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold">
                {serviceTiers[selectedTier]?.name} - {serviceTiers[selectedTier]?.options.find(opt => opt.id === selectedOption)?.name}
              </span>
              <p className="text-sm text-gray-600">
                {serviceTiers[selectedTier]?.options.find(opt => opt.id === selectedOption)?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">
                ₹{serviceTiers[selectedTier]?.options.find(opt => opt.id === selectedOption)?.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Final Price</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTierSelector;
