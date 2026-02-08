'use client';

import { useState, useMemo } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckIcon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore, addHours, startOfDay, isAfter } from 'date-fns';
import LocationPicker from './LocationPicker';
import { UBCLocation } from '@/lib/ubcLocations';

interface ProposedDate {
  date: Date;
  startTime: string;
  endTime: string;
}

interface MeetupSchedulerProps {
  listingTitle: string;
  otherPartyName: string;
  onSchedule: (date: ProposedDate, location: UBCLocation) => void;
  onCancel?: () => void;
  existingProposals?: ProposedDate[];
  selectedLocation?: UBCLocation | null;
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export default function MeetupScheduler({
  listingTitle,
  otherPartyName,
  onSchedule,
  onCancel,
  existingProposals = [],
  selectedLocation: initialLocation
}: MeetupSchedulerProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [location, setLocation] = useState<UBCLocation | null>(initialLocation || null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [step, setStep] = useState<'date' | 'time' | 'location' | 'confirm'>('date');

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
    setSelectedDate(null);
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const isDateSelectable = (date: Date) => {
    const now = new Date();
    const minDate = addHours(startOfDay(now), 2); // At least 2 hours from now
    return isAfter(date, minDate);
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  const filteredTimeSlots = useMemo(() => {
    if (!selectedDate || !isToday(selectedDate)) return TIME_SLOTS;
    
    const now = new Date();
    const currentHour = now.getHours();
    const minSlot = TIME_SLOTS.findIndex(slot => parseInt(slot.split(':')[0]) > currentHour + 2);
    return minSlot > -1 ? TIME_SLOTS.slice(minSlot) : [];
  }, [selectedDate]);

  const canProceed = () => {
    switch (step) {
      case 'date': return selectedDate !== null;
      case 'time': return startTime && endTime && startTime < endTime;
      case 'location': return location !== null;
      case 'confirm': return true;
      default: return false;
    }
  };

  const handleConfirm = () => {
    if (selectedDate && location) {
      onSchedule(
        {
          date: selectedDate,
          startTime,
          endTime
        },
        location
      );
    }
  };

  const formatDateDisplay = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-ubc-blue to-primary px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Schedule Meetup</h2>
              <p className="text-white/80 text-sm">{listingTitle}</p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {['date', 'time', 'location', 'confirm'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step === s 
                  ? 'bg-ubc-blue text-white' 
                  : ['date', 'time', 'location', 'confirm'].indexOf(step) > idx
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {['date', 'time', 'location', 'confirm'].indexOf(step) > idx ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  idx + 1
                )}
              </div>
              {idx < 3 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  ['date', 'time', 'location', 'confirm'].indexOf(step) > idx
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Date</span>
          <span>Time</span>
          <span>Location</span>
          <span>Confirm</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date Selection */}
        {step === 'date' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePreviousWeek}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <h3 className="font-semibold text-gray-900">
                {format(currentWeekStart, 'MMMM yyyy')}
              </h3>
              <button
                onClick={handleNextWeek}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {weekDays.map((date, idx) => {
                const selectable = isDateSelectable(date);
                return (
                  <button
                    key={idx}
                    onClick={() => selectable && setSelectedDate(date)}
                    disabled={!selectable}
                    className={`p-3 rounded-xl text-center transition-all ${
                      isDateSelected(date)
                        ? 'bg-ubc-blue text-white shadow-lg'
                        : selectable
                        ? 'hover:bg-ubc-blue/5 text-gray-900'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium">{format(date, 'd')}</div>
                    <div className="text-xs mt-1">{format(date, 'EEE')}</div>
                    {isToday(date) && (
                      <div className={`text-xs mt-1 ${isDateSelected(date) ? 'text-white/80' : 'text-ubc-blue'}`}>
                        Today
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Time Selection */}
        {step === 'time' && selectedDate && (
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">Selected Date</h3>
              <p className="text-gray-600">{formatDateDisplay(selectedDate)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    if (e.target.value >= endTime) {
                      const [hours] = e.target.value.split(':').map(Number);
                      setEndTime(`${(hours + 1).toString().padStart(2, '0')}:00`);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ubc-blue focus:ring-2 focus:ring-ubc-blue/20 outline-none"
                >
                  {filteredTimeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ubc-blue focus:ring-2 focus:ring-ubc-blue/20 outline-none"
                >
                  {filteredTimeSlots.filter(t => t > startTime).map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 text-ubc-blue" />
                <span className="text-gray-700">
                  Meetup duration: <strong>{parseInt(endTime) - parseInt(startTime)} hours</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Location Selection */}
        {step === 'location' && (
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{formatDateDisplay(selectedDate!)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ClockIcon className="h-5 w-5" />
                <span>{startTime} - {endTime}</span>
              </div>
            </div>

            {location ? (
              <div className="bg-ubc-blue/5 rounded-xl p-4 border border-ubc-blue/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="h-6 w-6 text-ubc-blue" />
                    <div>
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <p className="text-sm text-gray-500">{location.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLocationPicker(true)}
                    className="text-sm text-ubc-blue hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLocationPicker(true)}
                className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-ubc-blue hover:bg-ubc-blue/5 transition-all"
              >
                <MapPinIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="font-medium text-gray-600">Choose a Meetup Location</p>
                <p className="text-sm text-gray-400">Select from our safe UBC locations</p>
              </button>
            )}
          </div>
        )}

        {/* Confirmation */}
        {step === 'confirm' && selectedDate && location && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-ubc-blue/10 to-primary/10 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📋 Meetup Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-ubc-blue" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDateDisplay(selectedDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-ubc-blue" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{startTime} - {endTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-ubc-blue" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-ubc-blue" />
                  <div>
                    <p className="text-sm text-gray-500">Meeting with</p>
                    <p className="font-medium">{otherPartyName}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please arrive 5 minutes early. 
                Contact the other party if you're running late.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
        <button
          onClick={() => {
            const steps = ['date', 'time', 'location', 'confirm'];
            const currentIdx = steps.indexOf(step);
            if (currentIdx > 0) setStep(steps[currentIdx - 1] as any);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            step === 'date' ? 'invisible' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          Back
        </button>

        {step !== 'confirm' ? (
          <button
            onClick={() => {
              const steps = ['date', 'time', 'location', 'confirm'];
              const currentIdx = steps.indexOf(step);
              if (currentIdx < steps.length - 1) setStep(steps[currentIdx + 1] as any);
            }}
            disabled={!canProceed()}
            className="px-6 py-2 bg-gradient-to-r from-ubc-blue to-primary text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            Confirm Meetup
          </button>
        )}
      </div>

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <LocationPicker
              onSelect={(loc) => {
                setLocation(loc);
                setShowLocationPicker(false);
              }}
              selectedLocation={location}
              onClose={() => setShowLocationPicker(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
