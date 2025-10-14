import React, { useState, useEffect } from 'react';

// SVG Icons
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

const BasecampIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
    <path d="M23.869 17.31 15.813 5.864c-0.003 -0.004 -0.006 -0.007 -0.009 -0.011a0.708 0.708 0 0 0 -0.095 -0.106q-0.009 -0.008 -0.018 -0.016a0.766 0.766 0 0 0 -0.059 -0.045l-0.003 -0.002a0.67 0.67 0 0 0 -0.069 -0.041c-0.005 -0.002 -0.01 -0.004 -0.014 -0.007a0.67 0.67 0 0 0 -0.058 -0.026q-0.01 -0.004 -0.021 -0.008a0.67 0.67 0 0 0 -0.056 -0.017q-0.011 -0.003 -0.023 -0.006a0.766 0.766 0 0 0 -0.059 -0.011c-0.007 -0.001 -0.014 -0.002 -0.021 -0.003a0.766 0.766 0 0 0 -0.081 -0.005h-6.453a0.718 0.718 0 0 0 -0.587 0.305L0.131 17.31A0.718 0.718 0 0 0 0.718 18.441h22.564a0.718 0.718 0 0 0 0.587 -1.131m-9.361 -0.305h-5.955l5.955 -8.461zM9.146 6.995h4.697L6.798 17.005H2.101zm6.798 10.01V8.544l5.955 8.461z"/>
  </svg>
);

const LightIcon = () => (
  <svg className="swap-on fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
  </svg>
);

const DarkIcon = () => (
  <svg className="swap-off fill-current w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
  </svg>
);

const HeroImage = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170";

// Login Page Component
function LoginPage({ setCurrentPage, theme, toggleTheme }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [allLogins, setAllLogins] = useState([]);

  // Fetch all logins for testing
  useEffect(() => {
    const fetchLogins = async () => {
      try {
        const response = await fetch("http://localhost:8000/logins");
        const data = await response.json();
        setAllLogins(data.logins);
      } catch (error) {
        console.error("Error fetching logins:", error);
      }
    };
    fetchLogins();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/logins");
      const data = await response.json();

      const match = data.logins.find(
        (user) => user.username === username && user.password === password
      );

      if (match) {
        setMessage("✅ Login successful!");
      } else {
        setMessage("❌ Invalid username or password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Error connecting to server.");
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <button onClick={() => setCurrentPage("home")} className="btn btn-ghost">
          ← Back to Home
        </button>
      </div>

      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        {/* Box showing all logins for testing */}
        <div className="bg-base-100 p-4 rounded-lg shadow-md w-96">
          <h2 className="text-xl font-bold mb-2 text-center">Current Logins</h2>
          {allLogins.length > 0 ? (
            <ul className="list-disc list-inside">
              {allLogins.map((user, index) => (
                <li key={index}>
                  {user.username} - {user.password}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No logins found.</p>
          )}
        </div>

        {/* Login form */}
        <div className="bg-base-100 p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button onClick={handleLogin} className="btn btn-primary w-full mb-4">
            Sign In
          </button>
          {message && (
            <p
              className={`text-center font-semibold ${
                message.includes("successful") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Signup Page Component
function SignupPage({ setCurrentPage, theme, toggleTheme }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    if (!username || !password) {
      setMessage("⚠️ Please enter both username and password.");
      return;
    }

    try {
      // 1. Fetch existing logins
      const response = await fetch("http://localhost:8000/logins");
      const data = await response.json();

      const existingUser = data.logins.find((user) => user.username === username);

      if (existingUser) {
        setMessage("❌ Username already exists. Please choose another.");
        return;
      }

      // 2. Add new user via POST request
      const postResponse = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (postResponse.ok) {
        setMessage("✅ Signup successful!");
        setUsername("");
        setPassword("");
      } else {
        const errorData = await postResponse.json();
        setMessage(`⚠️ Error: ${errorData.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Could not connect to server.");
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <button onClick={() => setCurrentPage("home")} className="btn btn-ghost">
          ← Back to Home
        </button>
      </div>

      <div className="flex items-center justify-center h-screen">
        <div className="bg-base-100 p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

          <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a username"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
            />
          </div>

          <button onClick={handleSignup} className="btn btn-primary w-full mb-4">
            Sign Up
          </button>

          {message && (
            <p
              className={`text-center font-semibold ${
                message.includes("successful") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

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
    return <LoginPage setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'signup') {
    return <SignupPage setCurrentPage={setCurrentPage} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      {/* Navbar */}
        <div className="navbar bg-base-100 shadow-lg">
          <div className="flex-1">
            <a className="btn btn-ghost">
              <BasecampIcon />
              <span className="text-2xl font-bold ml-2">Basecamp</span>
            </a>
          </div>
          <div className="flex-none gap-4">
            <label className="swap swap-rotate">
              <input type="checkbox" onClick={toggleTheme} />
                <LightIcon />
                <DarkIcon />
            </label>
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
          </div>
        </div>

      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-base-200" style={{ backgroundImage: 'url('+HeroImage+')' }}>
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-white">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Plan Together. Go Together.</h1>
            <p className="mb-5 text-lg">The ultimate site for college students to plan group trips without the hassle. Coordinate itineraries, vote on activities, and split expenses, all in one place.</p>
            <button className="btn btn-accent btn-lg">Get Started</button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why Basecamp?</h2>
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
               <div className="p-4 bg-success rounded-full text-accent-content">
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
