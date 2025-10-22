import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Add one day to compensate for timezone offset
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString();
};

function Trips({ setCurrentPage, theme, toggleTheme, currentUser, onLogout }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({
    name: '',
    start: '',
    end: '',
    description: ''
  });

  const url = "http://localhost:8000";

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(url+'/calendars/'+currentUser, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setTrips(data.calendars);
          setError(null);
        } else {
          setError(data.message);
          setTrips([]);
        }
      } catch (err) {
        setError('Failed to fetch trips');
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchTrips();
    }
  }, [currentUser, url]);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(url+'/calendars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTrip,
          username: currentUser
        })
      });

      const data = await response.json();

      if (data.success) {
        setTrips(prev => [...prev, data.calendar]);
        setNewTrip({
          name: '',
          start: '',
          end: '',
          description: ''
        });
        setIsModalOpen(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create trip');
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={onLogout}
        setCurrentPage={setCurrentPage}
      />
      
      {/* Create Trip Modal */}
      <dialog id="create_trip_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create New Trip</h3>
          <form onSubmit={handleCreateTrip}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Trip Name</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter trip name" 
                className="input input-bordered w-full" 
                value={newTrip.name}
                onChange={(e) => setNewTrip(prev => ({...prev, name: e.target.value}))}
                required
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input 
                type="date" 
                className="input input-bordered w-full" 
                value={newTrip.start}
                onChange={(e) => setNewTrip(prev => ({...prev, start: e.target.value}))}
                required
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input 
                type="date" 
                className="input input-bordered w-full" 
                value={newTrip.end}
                onChange={(e) => setNewTrip(prev => ({...prev, end: e.target.value}))}
                required
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea 
                className="textarea textarea-bordered w-full" 
                placeholder="Enter trip description"
                value={newTrip.description}
                onChange={(e) => setNewTrip(prev => ({...prev, description: e.target.value}))}
              />
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Create Trip</button>
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
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-base-content">My Trips</h1>
          {trips.length > 0 ? (
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="btn btn-primary btn-lg"
            >
              + Create New Trip
            </button>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error max-w-2xl mx-auto my-8">
            <span>{error}</span>
          </div>
        ) : trips.length === 0 ? (
          <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto my-16">
            <div className="card-body text-center py-16">
              <h2 className="card-title justify-center text-2xl mb-4">No trips yet!</h2>
              <p className="text-lg mb-8 text-base-content/70">Create your first trip to get started planning your adventures.</p>
              <div className="card-actions justify-center">
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="btn btn-primary btn-lg"
                >
                  + Create Trip
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div 
                key={trip._id} 
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" 
                onClick={() => setCurrentPage('trip-details', trip._id)}
              >
                <div className="card-body p-8">
                  <h2 className="card-title text-xl mb-3">{trip.name}</h2>
                  <p className="text-sm text-base-content/70 mb-4">
                    {formatDisplayDate(trip.start)} - {formatDisplayDate(trip.end)}
                  </p>
                  <p className="line-clamp-2 text-base-content/80">{trip.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Trips;