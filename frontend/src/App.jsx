import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Itinerary from './pages/Itinerary';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Function to handle successful login
  const handleLogin = (username) => {
    setCurrentUser(username);
    setCurrentPage('itinerary');
  };

  // Function to handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  // Decides which page to display
  if (currentPage === 'login') {
    return <Login setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} onLoginSuccess={handleLogin} />;
  }
  
  if (currentPage === 'signup') {
    return <Signup setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'itinerary') {
    return <Itinerary setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} currentUser={currentUser} onLogout={handleLogout} />;
  }

  return (
    <Home 
      setCurrentPage={setCurrentPage} 
      theme={theme} 
      toggleTheme={toggleTheme}
      currentUser={currentUser}
    />
  );
}

export default App;
