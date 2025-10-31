import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';

const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString();
};

const formatDayHeader = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const getDaysBetween = (start, end) => {
  const days = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  startDate.setDate(startDate.getDate() + 1);
  endDate.setDate(endDate.getDate() + 1);
  
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function TripEvents({ setCurrentPage, theme, toggleTheme, currentUser, currentID, onLogout, currentTrip }) {
  const [trip, setTrip] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const scrollContainerRef = useRef(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    details: '',
  });

  const url = "http://localhost:8000";

  useEffect(() => {
    const fetchEvents = async () => {
      console.log('Fetching trip data for tripId:', tripId);
      try {
        const eventsResponse = await fetch(`${url}/events/calendar/${tripId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const eventsData = await eventsResponse.json();
        
        if (eventsData.success && eventsData.events) {
          setEvents(eventsData.events);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching trip data:', err);
        setError('Failed to fetch trip details');
        setTrip(null);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && currentTrip) {
      fetchTripAndEvents();
    } else {
      setIsLoading(false);
    }
  }, [currentUser, currentTrip, url]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${url}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEvent,
          trip_id: currentTrip._id,
          creator: currentID
        })
      });

      const data = await response.json();

      if (data.success) {
        setEvents(prev => [...prev, data.event]);
        setNewEvent({
          title: '',
          start: '',
          end: '',
          details: '',
        });
        setIsModalOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create event');
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const openModalForDate = (date) => {
    const dateKey = getDateKey(date);
    setSelectedDate(dateKey);
    setNewEvent(prev => ({ ...prev, date: dateKey }));
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div data-theme={theme} className="min-h-screen bg-base-200">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          currentUser={currentUser}
          onLogout={onLogout}
          setCurrentPage={setCurrentPage}
        />
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div data-theme={theme} className="min-h-screen bg-base-200">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          currentUser={currentUser}
          onLogout={onLogout}
          setCurrentPage={setCurrentPage}
        />
        <div className="alert alert-error max-w-2xl mx-auto my-8">
          <span>{error || 'Trip not found'}</span>
        </div>
      </div>
    );
  }

  const days = getDaysBetween(trip.start, trip.end);
  
  // Group events by date
  const eventsByDate = {};
  events.forEach(event => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  // Sort events within each day by start time
  Object.keys(eventsByDate).forEach(date => {
    eventsByDate[date].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  });

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={onLogout}
        setCurrentPage={setCurrentPage}
      />
      
      {/* Create Event Modal */}
      <dialog id="create_event_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Create New Event</h3>
          <form onSubmit={handleCreateEvent}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Event Name</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter event name" 
                className="input input-bordered w-full" 
                value={newEvent.name}
                onChange={(e) => setNewEvent(prev => ({...prev, name: e.target.value}))}
                required
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input 
                type="date" 
                className="input input-bordered w-full" 
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({...prev, date: e.target.value}))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Start Time</span>
                </label>
                <input 
                  type="time" 
                  className="input input-bordered w-full" 
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent(prev => ({...prev, startTime: e.target.value}))}
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">End Time</span>
                </label>
                <input 
                  type="time" 
                  className="input input-bordered w-full" 
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent(prev => ({...prev, endTime: e.target.value}))}
                  required
                />
              </div>
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter location" 
                className="input input-bordered w-full" 
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({...prev, location: e.target.value}))}
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea 
                className="textarea textarea-bordered w-full" 
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({...prev, description: e.target.value}))}
                rows="3"
              />
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Create</button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)} />
      </dialog>

      <div className="max-w-full px-8 py-12">
        <div className="mb-8">
          <button 
            onClick={() => setCurrentPage('trips')} 
            className="btn btn-ghost btn-sm mb-4"
          >
            ← Back to Trips
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-base-content">{trip.name}</h1>
              <p className="text-lg text-base-content/70 mt-2">
                {formatDisplayDate(trip.start)} - {formatDisplayDate(trip.end)}
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="btn btn-primary btn-lg"
            >
              + Add Event
            </button>
          </div>
        </div>

        <div className="relative">
          {days.length > 3 && (
            <>
              <button 
                onClick={scrollLeft}
                className="btn btn-circle btn-lg absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-lg"
              >
                ‹
              </button>
              <button 
                onClick={scrollRight}
                className="btn btn-circle btn-lg absolute right-0 top-1/2 -translate-y-1/2 z-10 shadow-lg"
              >
                ›
              </button>
            </>
          )}

          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
              {days.map((day) => {
                const dateKey = getDateKey(day);
                const dayEvents = eventsByDate[dateKey] || [];
                
                return (
                  <div 
                    key={dateKey} 
                    className="flex-shrink-0 w-80"
                  >
                    <div className="card bg-base-100 shadow-xl h-full">
                      <div className="card-body p-6">
                        <h2 className="card-title text-lg mb-4 border-b pb-3">
                          {formatDayHeader(dateKey)}
                        </h2>
                        
                        <div className="space-y-3 min-h-[400px]">
                          {dayEvents.length === 0 ? (
                            <div className="text-center py-8 text-base-content/50">
                              <p className="mb-4">No events yet</p>
                              <button 
                                onClick={() => openModalForDate(day)}
                                className="btn btn-sm btn-outline"
                              >
                                + Add Event
                              </button>
                            </div>
                          ) : (
                            <>
                              {dayEvents.map((event) => (
                                <div 
                                  key={event._id}
                                  className="card bg-primary/10 border border-primary/20 hover:shadow-md transition-all cursor-pointer"
                                >
                                  <div className="card-body p-4">
                                    <h3 className="font-semibold text-base mb-1">
                                      {event.name}
                                    </h3>
                                    <p className="text-sm text-base-content/70 mb-2">
                                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                    </p>
                                    {event.location && (
                                      <p className="text-sm text-base-content/60 mb-1">
                                        📍 {event.location}
                                      </p>
                                    )}
                                    {event.description && (
                                      <p className="text-sm text-base-content/80 line-clamp-2">
                                        {event.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <button 
                                onClick={() => openModalForDate(day)}
                                className="btn btn-sm btn-outline w-full mt-2"
                              >
                                + Add Event
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripEvents;