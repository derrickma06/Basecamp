import React, { useState, useEffect } from 'react';
import { CalendarIcon, BasecampIcon, LightIcon, DarkIcon } from '../components/Icons'; // Import icons
import Navbar from '../components/Navbar';

function Itinerary({ setCurrentPage, theme, toggleTheme, currentUser, onLogout }) {

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
        
        <div className="p-8 bg-base-100 rounded-lg shadow-xl text-center">
          <CalendarIcon />
          <h3 className="text-2xl font-bold mt-4">Calendar Coming Soon!</h3>
          <p className="mt-2">This is where your collaborative trip planner will live.</p>
          <button className="btn btn-primary mt-6">Add New Event</button>
        </div>
      </div>
    </div>
  );
}

export default Itinerary;