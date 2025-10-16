import React, { useState, useEffect } from 'react';

function Login({ setCurrentPage, theme, toggleTheme }) {
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
      console.log("Logins fetched:", response);

      const match = data.logins.find(
        (user) => user.username === username && user.password === password
      );

      if (match) {
        setMessage("Login successful!");
      } else {
        setMessage("Invalid username or password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <button onClick={() => setCurrentPage("home")} className="btn btn-ghost">
          Back to Home
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

export default Login;