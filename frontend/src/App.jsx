import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('http://localhost:8000/')
        .then(response => {
          console.log('Response received:', response);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Data received:', data);
          setMessage(data.message);
        })
        .catch(error => {
          console.error('Fetch error:', error.message);
          setMessage('Failed to load message');
          setError(error.message);
        });
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-8">TripSync</h1>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Backend Message</h2>
                <p className="text-lg">
                  {message === 'Loading...' ? (
                    <span className="loading loading-dots loading-lg"></span>
                  ) : (
                    <span className="font-semibold">{message}</span>
                  )}
                </p>
                {error && (
                  <div className="alert alert-error mt-4">
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;