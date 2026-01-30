
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoStep from '@/app/components/plan/BasicInfoStep';
import GoOutTypesStep from '@/app/components/plan/GoOutTypesStep';

export default function PlanItinerary() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Mandatory fields
    startTime: '',
    budget: '',
    numberOfPeople: '',
    startLocation: { lat: '', lng: '' },
    
    // Optional fields
    endTime: '',
    endLocation: { lat: '', lng: '' },
    extraInfo: '',
    travelTolerance: [],
    
    // Preferred types with filters
    preferredTypes: []
  });

  const handleStepComplete = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setStep(2);
  };

  const handleSubmit = async () => {
    try {
      // Transform formData to API format
      const apiPayload = {
        startTime: parseInt(formData.startTime),
        budget: parseFloat(formData.budget),
        numberOfPeople: parseInt(formData.numberOfPeople),
        startLocation: {
          lat: parseFloat(formData.startLocation.lat),
          lng: parseFloat(formData.startLocation.lng)
        },
        preferredTypes: formData.preferredTypes
      };

      // Add optional fields if present
      if (formData.endTime) apiPayload.endTime = parseInt(formData.endTime);
      if (formData.endLocation.lat && formData.endLocation.lng) {
        apiPayload.endLocation = {
          lat: parseFloat(formData.endLocation.lat),
          lng: parseFloat(formData.endLocation.lng)
        };
      }
      if (formData.extraInfo) apiPayload.extraInfo = formData.extraInfo;
      if (formData.travelTolerance.length > 0) {
        apiPayload.travelTolerance = formData.travelTolerance;
      }

      // preferredTypes now contains the new structure with filters or specific venues
      // No need to merge - send as-is

      console.log('📤 Sending payload:', JSON.stringify(apiPayload, null, 2));

      const response = await fetch('/api/plan-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload)
      });

      const result = await response.json();
      console.log('Result:', result);
      
      if (response.ok && result.success) {
        // Store results and original request in sessionStorage for clean URL
        sessionStorage.setItem('itineraryResults', JSON.stringify(result));
        sessionStorage.setItem('originalRequest', JSON.stringify(apiPayload));
        router.push('/results');
      } else {
        // Show detailed error message
        const errorMsg = result.details || result.error || 'Failed to generate itinerary';
        alert(`❌ ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Plan Your Perfect Day
          </h1>
          <p className="text-gray-600">
            Create a personalized itinerary tailored to your preferences
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <BasicInfoStep
              formData={formData}
              onNext={handleStepComplete}
            />
          )}
          
          {step === 2 && (
            <GoOutTypesStep
              formData={formData}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
              setFormData={setFormData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
