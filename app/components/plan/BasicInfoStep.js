
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';

export default function BasicInfoStep({ formData, onNext }) {
  const [localData, setLocalData] = useState(formData);
  const [showOptional, setShowOptional] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!localData.startTime) newErrors.startTime = 'Start time is required';
    if (!localData.budget) newErrors.budget = 'Budget is required';
    if (!localData.numberOfPeople) newErrors.numberOfPeople = 'Number of people is required';
    if (!localData.startLocation.lat || !localData.startLocation.lng) {
      newErrors.startLocation = 'Start location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext(localData);
    }
  };

  const handleTravelToleranceToggle = (value) => {
    const current = localData.travelTolerance || [];
    const newTolerance = current.includes(value)
      ? current.filter(t => t !== value)
      : [...current, value];
    
    setLocalData(prev => ({ ...prev, travelTolerance: newTolerance }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-yellow-300 mb-6">Basic Information</h2>
        
        {/* Mandatory Fields */}
        <div className="space-y-4">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-yellow-300 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="23"
              placeholder="18 (6 PM in 24-hour format)"
              value={localData.startTime}
              onChange={(e) => setLocalData(prev => ({ ...prev, startTime: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[#F5F5F7] font-semibold ${
                errors.startTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-yellow-300 mb-2">
              Total Budget (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="5000"
              value={localData.budget}
              onChange={(e) => setLocalData(prev => ({ ...prev, budget: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[#F5F5F7] font-semibold ${
                errors.budget ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-sm font-medium text-yellow-300 mb-2">
              Number of People <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="2"
              value={localData.numberOfPeople}
              onChange={(e) => setLocalData(prev => ({ ...prev, numberOfPeople: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[#F5F5F7] font-semibold ${
                errors.numberOfPeople ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.numberOfPeople && <p className="text-red-500 text-sm mt-1">{errors.numberOfPeople}</p>}
          </div>

          {/* Start Location */}
          <div>
            <label className="block text-sm font-medium text-yellow-300 mb-2">
              Start Location <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="any"
                placeholder="Latitude (e.g., 28.7041)"
                value={localData.startLocation.lat}
                onChange={(e) => setLocalData(prev => ({
                  ...prev,
                  startLocation: { ...prev.startLocation, lat: e.target.value }
                }))}
                className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[#F5F5F7] font-semibold ${
                  errors.startLocation ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude (e.g., 77.1025)"
                value={localData.startLocation.lng}
                onChange={(e) => setLocalData(prev => ({
                  ...prev,
                  startLocation: { ...prev.startLocation, lng: e.target.value }
                }))}
                className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[#F5F5F7] font-semibold ${
                  errors.startLocation ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.startLocation && <p className="text-red-500 text-sm mt-1">{errors.startLocation}</p>}
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              You can get coordinates from Google Maps
            </p>
          </div>
        </div>

        {/* Configure More Dropdown */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center justify-between w-full px-4 py-3 bg-[#FF9933] hover:bg-[#e68a29] rounded-lg transition-colors"
          >
            <span className="font-bold text-black">Configure More Options</span>
            {showOptional ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
          </button>

          {showOptional && (
            <div className="mt-4 space-y-4 p-4 rounded-lg bg-gradient-to-br from-gray-800 to-black">
              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2">
                  End Time (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  placeholder="22 (10 PM in 24-hour format)"
                  value={localData.endTime}
                  onChange={(e) => setLocalData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[#F5F5F7] font-semibold bg-transparent"
                />
              </div>

              {/* End Location */}
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2">
                  End Location (Optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={localData.endLocation.lat}
                    onChange={(e) => setLocalData(prev => ({
                      ...prev,
                      endLocation: { ...prev.endLocation, lat: e.target.value }
                    }))}
                    className="px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[#F5F5F7] font-semibold bg-transparent"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={localData.endLocation.lng}
                    onChange={(e) => setLocalData(prev => ({
                      ...prev,
                      endLocation: { ...prev.endLocation, lng: e.target.value }
                    }))}
                    className="px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-[#F5F5F7] font-semibold bg-transparent"
                  />
                </div>
              </div>

              {/* Extra Info */}
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2">
                  Additional Preferences (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="E.g., romantic evening, good ambience, live music..."
                  value={localData.extraInfo}
                  onChange={(e) => setLocalData(prev => ({ ...prev, extraInfo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-[#F5F5F7] font-semibold bg-transparent"
                />
              </div>

              {/* Travel Tolerance */}
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2">
                  Travel Tolerance (Optional)
                </label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleTravelToleranceToggle(level)}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors capitalize ${
                        (localData.travelTolerance || []).includes(level)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-transparent text-gray-200 border-gray-600 hover:border-purple-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
      >
        Next: Choose Go-Out Types
      </button>
    </form>
  );
}
