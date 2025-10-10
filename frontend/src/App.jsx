// import React, { useState, useEffect } from 'react';

// function App() {
//   const [message, setMessage] = useState('Loading...');
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     fetch('http://localhost:8000/')
//         .then(response => {
//           console.log('Response received:', response);
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then(data => {
//           console.log('Data received:', data);
//           setMessage(data.message);
//         })
//         .catch(error => {
//           console.error('Fetch error:', error.message);
//           setMessage('Failed to load message');
//           setError(error.message);
//         });
//   }, []);

//   return (
//     <div className="min-h-screen bg-base-200">
//       <div className="hero min-h-screen">
//         <div className="hero-content text-center">
//           <div className="max-w-md">
//             <h1 className="text-5xl font-bold mb-8">TripSync</h1>
//             <div className="card bg-base-100 shadow-xl">
//               <div className="card-body">
//                 <h2 className="card-title text-2xl mb-4">Backend Message</h2>
//                 <p className="text-lg">
//                   {message === 'Loading...' ? (
//                     <span className="loading loading-dots loading-lg"></span>
//                   ) : (
//                     <span className="font-semibold">{message}</span>
//                   )}
//                 </p>
//                 {error && (
//                   <div className="alert alert-error mt-4">
//                     <span>{error}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';

// SVG Icons for features - placing them here keeps the component self-contained
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MoneyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


function App() {
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

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      {/* Navbar */}
        <div className="navbar bg-base-100 shadow-lg">
          <div className="flex-1">
            <a className="btn btn-ghost text-2xl font-bold">TripSync</a>
          </div>
          <div className="flex-none gap-4">
            <label className="swap swap-rotate">
          <input type="checkbox" onClick={toggleTheme} />
          <svg className="swap-on fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          <svg className="swap-off fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
            </label>
            <div className="flex items-center space-x-4">
          <a className="btn btn-ghost">Log In</a>
          <a className="btn btn-primary">Sign Up</a>
            </div>
          </div>
        </div>

      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-base-200" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)' }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-white">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Plan Together. Go Together.</h1>
            <p className="mb-5 text-lg">The ultimate app for college students to plan group trips without the hassle. Coordinate itineraries, vote on activities, and split expenses, all in one place.</p>
            <button className="btn btn-success btn-lg">Get Started</button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why TripSync?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl text-center">
            <div className="card-body items-center">
               <div className="p-4 bg-primary rounded-full text-primary-content">
                 <CalendarIcon />
               </div>
              <h3 className="card-title text-2xl mt-4">Collaborative Itinerary</h3>
              <p>Build your trip's schedule together in real-time. No more messy group chats or conflicting spreadsheets.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl text-center">
            <div className="card-body items-center">
              <div className="p-4 bg-info rounded-full text-secondary-content">
                <VoteIcon />
              </div>
              <h3 className="card-title text-2xl mt-4">Group Voting</h3>
              <p>Can't decide on a restaurant or an activity? Let the group vote! Settle debates quickly and democratically.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl text-center">
            <div className="card-body items-center">
               <div className="p-4 bg-accent rounded-full text-accent-content">
                 <MoneyIcon />
               </div>
              <h3 className="card-title text-2xl mt-4">Expense Splitting</h3>
              <p>Easily track who paid for what. Settle up at the end of the trip without any awkward conversations.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Backend Status Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <div className={`mt-2 p-2 rounded-md text-sm font-semibold ${isError ? 'bg-error text-error-content' : 'bg-success text-success-content'}`}>
            Backend Status: {backendMessage}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
