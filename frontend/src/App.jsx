import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  })

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
    //Decides which page to display
    if (currentPage === 'login') {
      return <Login setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} />;
    }
  
    if (currentPage === 'signup') {
      return <Signup setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} />;
    }

    return (
      <Home 
        setCurrentPage={setCurrentPage} 
        theme={theme} 
        toggleTheme={toggleTheme}
      />
    );
}

export default App;
