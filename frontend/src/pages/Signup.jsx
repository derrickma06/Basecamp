import React, { useState, useEffect } from "react";

function Signup({ setCurrentPage, theme, toggleTheme }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    try {
      // Fetch existing logins
      const response = await fetch("http://localhost:8000/logins");
      const data = await response.json();

      const existingUser = data.logins.find((user) => user.username === username);

      if (existingUser) {
        setMessage("Username already exists. Please choose another.");
        return;
      }

      // Add new user via POST request
      const postResponse = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (postResponse.ok) {
        setMessage("Signup successful!");
        setUsername("");
        setPassword("");
      } else {
        const errorData = await postResponse.json();
        setMessage(`Error: ${errorData.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to server.");
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <button onClick={() => setCurrentPage("home")} className="btn btn-ghost">
          Back to Home
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

          <button 
            onClick={() => setCurrentPage("login")} 
            className="btn btn-link w-full"
          >
            Have an existing account? Login instead
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

export default Signup;