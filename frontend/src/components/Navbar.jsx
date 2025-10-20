import React from 'react';
import { BasecampIcon, LightIcon, DarkIcon } from './Icons';

function Navbar({ theme, toggleTheme, currentUser, onLogout, setCurrentPage }) {
  // Render different actions based on whether user is logged in
  const renderActions = () => {
    if (currentUser) {
      return (
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Welcome, {currentUser}!</span>
          <button 
            onClick={onLogout} 
            className="btn btn-ghost"
          >
            Log Out
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setCurrentPage('login')} 
          className="btn btn-ghost"
        >
          Log In
        </button>
        <button 
          onClick={() => setCurrentPage('signup')} 
          className="btn btn-primary"
        >
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <button onClick={() => setCurrentPage('home')} className="btn btn-ghost">
          <BasecampIcon />
          <span className="text-2xl font-bold ml-2">Basecamp</span>
        </button>
      </div>
      <div className="flex-none gap-4">
        <label className="swap swap-rotate">
          <input 
            type="checkbox" 
            onClick={toggleTheme} 
            checked={theme === 'dark'} 
            readOnly 
          />
          <LightIcon />
          <DarkIcon />
        </label>
        {renderActions()}
      </div>
    </div>
  );
}

export default Navbar;