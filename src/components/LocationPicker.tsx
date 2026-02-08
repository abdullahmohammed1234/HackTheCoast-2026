'use client';

import { useState, useMemo } from 'react';
import { 
  MapPinIcon, 
  CheckIcon, 
  ShieldCheckIcon,
  BuildingOfficeIcon,
  SunIcon,
  GlobeAltIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { UBCLocation, UBC_LOCATIONS, LOCATION_CATEGORIES } from '@/lib/ubcLocations';

interface LocationPickerProps {
  onSelect: (location: UBCLocation) => void;
  selectedLocation?: UBCLocation | null;
  onClose?: () => void;
}

export default function LocationPicker({ onSelect, selectedLocation, onClose }: LocationPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState<UBCLocation | null>(null);

  const filteredLocations = useMemo(() => {
    let filtered = UBC_LOCATIONS;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(loc => loc.type === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(loc => 
        loc.name.toLowerCase().includes(query) ||
        loc.address.toLowerCase().includes(query) ||
        loc.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'indoor': return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'outdoor': return <SunIcon className="h-5 w-5" />;
      case 'public': return <GlobeAltIcon className="h-5 w-5" />;
      default: return <MapPinIcon className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'indoor': return 'bg-blue-100 text-blue-700';
      case 'outdoor': return 'bg-green-100 text-green-700';
      case 'public': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-ubc-blue to-primary px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Safe Meetup Locations</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-white" />
            </button>
          )}
        </div>
        <p className="text-white/80 text-sm mt-1">Choose a safe UBC location for your exchange</p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ubc-blue focus:ring-2 focus:ring-ubc-blue/20 outline-none transition-all"
        />
        
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {LOCATION_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-ubc-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Badge */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-100">
          <div className="flex items-center gap-2 text-sm text-yellow-800">
            <StarIcon className="h-4 w-4" />
            <span>⭐ Recommended locations are marked for safety and convenience</span>
          </div>
        </div>
      )}

      {/* Location List */}
      <div className="max-h-[400px] overflow-y-auto">
        {filteredLocations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MapPinIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No locations found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedLocation?.id === location.id ? 'bg-ubc-blue/5 border-l-4 border-ubc-blue' : ''
                }`}
                onClick={() => {
                  setShowDetails(location);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(location.type)}`}>
                    {getTypeIcon(location.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{location.name}</h3>
                      {location.recommended && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          ⭐ Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{location.address}</p>
                    <p className="text-sm text-gray-400 truncate mt-1">{location.description}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(location);
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      selectedLocation?.id === location.id
                        ? 'bg-ubc-blue text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-ubc-blue hover:text-white'
                    }`}
                  >
                    <CheckIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-start gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">Safety Tips:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Meet during daylight hours when possible</li>
              <li>• Bring a friend or let someone know about the meeting</li>
              <li>• Choose busy, public locations</li>
              <li>• Trust your instincts - if it feels wrong, cancel</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Location Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(showDetails.type)}`}>
                    {getTypeIcon(showDetails.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{showDetails.name}</h3>
                    <p className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(showDetails.type)}`}>
                      {showDetails.type.charAt(0).toUpperCase() + showDetails.type.slice(1)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{showDetails.address}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-900">{showDetails.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Safety Notes</p>
                  <p className="text-gray-900">{showDetails.safetyNotes}</p>
                </div>

                {showDetails.amenities && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amenities</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {showDetails.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {showDetails.hours && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hours</p>
                    <p className="text-gray-900">{showDetails.hours}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    onSelect(showDetails);
                    setShowDetails(null);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-ubc-blue to-primary text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Select This Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
