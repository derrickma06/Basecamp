import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Itinerary from './pages/Itinerary';
import Trips from './pages/Trips';
import Profile from './pages/Profile';
import Events from './pages/Events';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'home';
  });  
  
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || null;
  });  
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const [currentID, setCurrentID] = useState(() => {
    return localStorage.getItem('currentID') || null;
  });
  
  // NEW: State to store the selected trip ID
  const [selectedTripId, setSelectedTripId] = useState(() => {
    return localStorage.getItem('selectedTripId') || null;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);
  
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', currentUser);
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (currentID) {
      localStorage.setItem('currentID', currentID);
    } else {
      localStorage.removeItem('currentID');
    }
  }, [currentID]);

  // NEW: Store selected trip ID in localStorage
  useEffect(() => {
    if (selectedTripId) {
      localStorage.setItem('selectedTripId', selectedTripId);
    } else {
      localStorage.removeItem('selectedTripId');
    }
  }, [selectedTripId]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Function to handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setCurrentUser(null);
      setCurrentID(null);
      setSelectedTripId(null);
      setCurrentPage('home');
    }
  };

  // NEW: Enhanced setCurrentPage function that can accept trip ID
  const handleSetCurrentPage = (page, tripId = null) => {
    setCurrentPage(page);
    if (tripId) {
      setSelectedTripId(tripId);
    }
  };

  // Decides which page to display
  if (currentPage === 'login') {
    return (
      <Login 
        setCurrentPage={handleSetCurrentPage} 
        theme={theme} 
        setCurrentID={setCurrentID} 
        setCurrentUser={setCurrentUser}
      />
    );
  }
  
  if (currentPage === 'signup') {
    return (
      <Signup 
        setCurrentPage={handleSetCurrentPage} 
        setCurrentUser={setCurrentUser}
        setCurrentID={setCurrentID}
        theme={theme} 
      />
    );
  }
  
  if (currentPage === 'trips') {
    return (
      <Trips 
        setCurrentPage={handleSetCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        currentID={currentID}
        onLogout={handleLogout}
      />
    );
  }

  //Events page route
  if (currentPage === 'events') {
    return (
      <Events 
        setCurrentPage={handleSetCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        currentID={currentID}
        onLogout={handleLogout}
        tripId={selectedTripId}
      />
    );
  }
  
  if (currentPage === 'itinerary') {
    return (
      <Itinerary 
        setCurrentPage={handleSetCurrentPage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />
    );
  }
  
  if (currentPage === 'profile') {
    return (
      <Profile
        setCurrentPage={handleSetCurrentPage}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onLogout={handleLogout}
      />
    );
  }
  
  return (
    <Home 
      setCurrentPage={handleSetCurrentPage} 
      theme={theme} 
      toggleTheme={toggleTheme}
      currentUser={currentUser}
      onLogout={handleLogout}
    />
  );
}

export default App;