import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Itinerary from './pages/Itinerary';

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
    if (window.confirm('Are you sure you want to log out?')) {
      setCurrentUser(null);
      setCurrentPage('home');
    }
  };

  // Decides which page to display
  if (currentPage === 'login') {
    return (
      <Login 
        setCurrentPage={setCurrentPage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onLoginSuccess={handleLogin} 
      />
    );
  }
  
  if (currentPage === 'signup') {
    return (
      <Signup 
        setCurrentPage={setCurrentPage} 
        setCurrentUser={setCurrentUser}
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
    );
  }

  if (currentPage === 'itinerary') {
    return (
      <Itinerary 
        setCurrentPage={setCurrentPage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <Home 
      setCurrentPage={setCurrentPage} 
      theme={theme} 
      toggleTheme={toggleTheme}
      currentUser={currentUser}
      onLogout={handleLogout}
    />
  );
}

export default App;
