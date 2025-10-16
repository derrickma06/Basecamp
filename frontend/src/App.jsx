import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [backendMessage, setBackendMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  })

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
      // Fetch the message from the FastAPI backend
      fetch('http://localhost:8000/')
        .then(response => {
          console.log('Response received:', response);
          console.log('Data received:', response.data);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setBackendMessage(data.message);
          setIsError(false);
        })
        .catch(error => {
          console.error('Error fetching message:', error);
          setBackendMessage('Failed to connect to the backend.');
          setIsError(true);
        });
    }, []);
  
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
        backendMessage={backendMessage}
        isError={isError}
      />
    );
}

export default App;
