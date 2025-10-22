import React, { useState, useEffect } from 'react';
import { CalendarIcon, BasecampIcon, LightIcon, DarkIcon } from '../components/Icons'; // Import icons
import Navbar from '../components/Navbar';

function Itinerary({ setCurrentPage, theme, toggleTheme, currentUser, onLogout }) {
  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);

  const url = "http://localhost:8000";

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch(url+'/calendars', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: currentUser }),
        });

        const data = await response.json();

        if (data.success) {
          setCalendars(data.calendars);
          // Fetch events for all calendars
          fetchEventsForCalendars(data.calendars);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchEventsForCalendars = async (calendars) => {
      try {
        const allEvents = [];
        
        for (const calendar of calendars) {
          const response = await fetch(url+'/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ calendar_id: calendar._id }),
          });

          const data = await response.json();

          if (data.success) {
            allEvents.push(...data.events);
          }
        }

        setEvents(allEvents);
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser) {
      fetchCalendars();
    }
  }, [currentUser]);

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <Navbar 
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={onLogout}
        setCurrentPage={setCurrentPage}
      />
      {/* Itinerary Content */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Your Trip Itinerary</h2>
        
        <div className="p-8 bg-base-100 rounded-lg shadow-xl">
          <CalendarIcon />
          <h3 className="text-2xl font-bold mt-4">Your Calendars</h3>
          <pre className="mt-4 text-left whitespace-pre-wrap">
            {JSON.stringify(calendars, null, 2)}
          </pre>
          
          <h3 className="text-2xl font-bold mt-8">Your Events</h3>
          <pre className="mt-4 text-left whitespace-pre-wrap">
            {JSON.stringify(events, null, 2)}
          </pre>
          
          <button className="btn btn-primary mt-6">Add New Event</button>
        </div>
      </div>
    </div>
  );
}

export default Itinerary;