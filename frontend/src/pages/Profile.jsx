import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Add one day to compensate for timezone offset
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString();
};

function Profile({ setCurrentPage, theme, toggleTheme, currentUser, setCurrentUser, onLogout }) {
  const [userProfile, setUserProfile] = useState({
    username: currentUser || '',
    email: '',
    joinedDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const url = "http://localhost:8000";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(url+'/profiles/'+currentUser);
        const data = await response.json();
        
        if (data.success) {
          setUserProfile({username: data.profile.username, email: data.profile.email, joinedDate: data.profile.date_created});
          setError(null);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser, url]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      console.log(currentUser);
      console.log(userProfile);
      const response = await fetch(url+'/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_username: currentUser,
          username: userProfile.username,
          email: userProfile.email,
          date_created: userProfile.joinedDate
        })
      });
      console.log(response);

      const data = await response.json();
      
      if (data.success) {
        setCurrentUser(userProfile.username);
        setIsEditing(false);
        setError(null);
        setMessage('');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={onLogout}
        setCurrentPage={setCurrentPage}
      />

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">My Profile</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-8">
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-8">
                  {/* Username Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-lg font-semibold">Username</span>
                    </label>
                    <input 
                      type="text" 
                      className="input input-bordered text-lg"
                      value={userProfile.username}
                      onChange={(e) => setUserProfile({...userProfile, username: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-lg font-semibold">Email</span>
                    </label>
                    <input 
                      type="email" 
                      className="input input-bordered text-lg"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Joined Date */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-lg font-semibold">Member Since</span>
                    </label>
                    <input 
                      type="text" 
                      className="input input-bordered text-lg"
                      value={formatDisplayDate(userProfile.joinedDate)}
                      disabled
                    />
                  </div>

                  {message && (
                    <p
                      className={`text-center font-semibold ${
                        message.includes("successful") ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {message}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="card-actions pt-4 flex justify-between">
                    {isEditing ? (
                      <>
                        <button 
                          type="button"
                          className="btn"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          type="button"
                          className="btn btn-outline btn-error" 
                          onClick={onLogout}
                        >
                          Logout
                        </button>
                        <button 
                          type="button"
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditing(true)
                          }}
                        >
                          Edit Profile
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;