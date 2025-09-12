import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const CustomTimePicker = ({ 
  value = '', 
  onChange, 
  label = 'Select Time',
  placeholder = 'Choose your preferred time',
  minTime = '04:00',
  maxTime = '22:00',
  disabled = false,
  className = '',
  error = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(value);
  const [tempTime, setTempTime] = useState(value);
  const [hours, setHours] = useState('09');
  const [minutes, setMinutes] = useState('00');
  const [period, setPeriod] = useState('AM');
  const [timeError, setTimeError] = useState('');

  // Handle custom time changes when hours, minutes, or period changes
  useEffect(() => {
    if (isOpen) {
      handleCustomTimeChange();
    }
  }, [hours, minutes, period, isOpen]);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const time24 = value.includes(':') ? value : convertTo24Hour(value);
      const [h, m] = time24.split(':');
      const hour24 = parseInt(h);
      const min = parseInt(m);
      
      if (hour24 === 0) {
        setHours('12');
        setPeriod('AM');
      } else if (hour24 < 12) {
        setHours(hour24.toString().padStart(2, '0'));
        setPeriod('AM');
      } else if (hour24 === 12) {
        setHours('12');
        setPeriod('PM');
      } else {
        setHours((hour24 - 12).toString().padStart(2, '0'));
        setPeriod('PM');
      }
      setMinutes(min.toString().padStart(2, '0'));
    }
  }, [value]);

  const convertTo24Hour = (time12) => {
    if (!time12) return '09:00';
    
    // Handle formats like "6 PM" or "6:30 PM"
    const match = time12.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (match) {
      let [, hour, min = '00', period] = match;
      hour = parseInt(hour);
      min = min || '00';
      
      if (period.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
      } else if (period.toUpperCase() === 'PM' && hour !== 12) {
        hour += 12;
      }
      
      return `${hour.toString().padStart(2, '0')}:${min}`;
    }
    
    return time12;
  };

  const convertTo12Hour = (time24) => {
    const [h, m] = time24.split(':');
    const hour24 = parseInt(h);
    const min = parseInt(m);
    
    if (hour24 === 0) {
      return `12:${m} AM`;
    } else if (hour24 < 12) {
      return `${hour24}:${m} AM`;
    } else if (hour24 === 12) {
      return `12:${m} PM`;
    } else {
      return `${hour24 - 12}:${m} PM`;
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    const [minHour, minMin] = minTime.split(':').map(Number);
    const [maxHour, maxMin] = maxTime.split(':').map(Number);
    
    for (let hour = minHour; hour <= maxHour; hour++) {
      const startMin = hour === minHour ? minMin : 0;
      const endMin = hour === maxHour ? maxMin : 59;
      
      for (let min = startMin; min <= endMin; min += 15) {
        if (hour === maxHour && min > maxMin) break;
        
        const time24 = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const time12 = convertTo12Hour(time24);
        options.push({ value: time24, label: time12 });
      }
    }
    
    return options;
  };

  const handleTimeSelect = (timeValue) => {
    setTempTime(timeValue);
    const time12 = convertTo12Hour(timeValue);
    setSelectedTime(time12);
  };

  const validateTime = (time24) => {
    if (!time24) return false;
    
    const [hours, minutes] = time24.split(':').map(Number);
    const [minHour, minMin] = minTime.split(':').map(Number);
    const [maxHour, maxMin] = maxTime.split(':').map(Number);
    
    const timeInMinutes = hours * 60 + minutes;
    const minTimeInMinutes = minHour * 60 + minMin;
    const maxTimeInMinutes = maxHour * 60 + maxMin;
    
    return timeInMinutes >= minTimeInMinutes && timeInMinutes <= maxTimeInMinutes;
  };

  const handleConfirm = () => {
    if (tempTime && validateTime(tempTime)) {
      onChange(tempTime);
      setSelectedTime(convertTo12Hour(tempTime));
      setTimeError('');
      setIsOpen(false);
    } else if (tempTime && !validateTime(tempTime)) {
      setTimeError(`Please select a time between ${minTime} and ${maxTime}`);
    }
  };

  const handleCancel = () => {
    setTempTime(selectedTime ? convertTo24Hour(selectedTime) : '');
    setIsOpen(false);
  };

  const handleCustomTimeChange = () => {
    let hour24 = parseInt(hours);
    
    if (period === 'AM') {
      if (hour24 === 12) {
        hour24 = 0; // 12 AM = 00:xx
      }
    } else { // PM
      if (hour24 !== 12) {
        hour24 += 12; // Add 12 to convert to 24-hour format
      }
      // 12 PM stays as 12
    }
    
    const time24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
    setTempTime(time24);
    setSelectedTime(convertTo12Hour(time24));
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className={`relative ${className}`}>
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-left flex items-center justify-between ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-orange-300'
          }`}
        >
          <span className={selectedTime ? 'text-gray-900' : 'text-gray-500'}>
            {selectedTime || placeholder}
          </span>
          <FontAwesomeIcon 
            icon={faClock} 
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
            <div className="p-4">
              {/* Quick Time Selection */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Select</h4>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {timeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTimeSelect(option.value)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        tempTime === option.value
                          ? 'bg-orange-100 border-orange-300 text-orange-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Time Input */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Time</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Hour</label>
                    <select
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h.toString().padStart(2, '0')}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Minute</label>
                    <select
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                        <option key={m} value={m.toString().padStart(2, '0')}>
                          {m.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Period</label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!tempTime}
                  className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-1" />
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Error Display */}
      {(error || timeError) && (
        <p className="mt-1 text-sm text-red-500">
          {error || timeError}
        </p>
      )}
    </div>
  );
};

export default CustomTimePicker;
