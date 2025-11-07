import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, FlightIcon, HotelIcon, FoodIcon, ActivityIcon, OtherIcon } from '../components/Icons';
import Navbar from '../components/Navbar';
import moment from 'moment';

// Event type icons mapping
const getEventIcon = (type) => {
  switch(type) {
    case 'Flight': return <FlightIcon/>;
    case 'Hotel': return <HotelIcon/>;
    case 'Food': return <FoodIcon/>;
    case 'Activity': return <ActivityIcon/>;
    default: return <OtherIcon/>;
  }
};

// Event type colors mapping
const getEventColor = (type) => {
  switch(type) {
    case 'Flight': return 'bg-sky-100 border-sky-300 hover:bg-sky-200';
    case 'Hotel': return 'bg-purple-100 border-purple-300 hover:bg-purple-200';
    case 'Food': return 'bg-orange-100 border-orange-300 hover:bg-orange-200';
    case 'Activity': return 'bg-green-100 border-green-300 hover:bg-green-200';
    default: return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
  }
};

const EventModal = ({ isOpen, onClose, onCreate, onSave, onDelete, eventInfo }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('13:00');
  const [details, setDetails] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [cost, setCost] = useState('');
  const [displayCost, setDisplayCost] = useState('');

  useEffect(() => {
    if (eventInfo) {
      setTitle(eventInfo.title || '');
      setStartTime(eventInfo.start ? moment(eventInfo.start).format('HH:mm') : '12:00');
      setEndTime(eventInfo.end ? moment(eventInfo.end).format('HH:mm') : '13:00');
      setDetails(eventInfo.details || '');
      setType(eventInfo.type || '');
      setLocation(eventInfo.location || '');
      const costValue = eventInfo.cost !== undefined ? eventInfo.cost : 0;
      setCost(costValue);
      setDisplayCost(costValue.toFixed(2));
    } else {
      setTitle('');
      setStartTime('12:00');
      setEndTime('13:00');
      setDetails('');
      setType('');
      setLocation('');
      setCost(0);
      setDisplayCost('0.00');
    }
  }, [eventInfo, isOpen]);

  const handleCreate = () => {
    if (!title) {
      alert("Please enter a title.");
      return;
    }
    if (moment(endTime, 'HH:mm').isSameOrBefore(moment(startTime, 'HH:mm'))) {
      alert("End time must be after start time.");
      return;
    }
    if (!type) {
      alert("Please select an event type.");
      return;
    }

    const date = moment(eventInfo.start).format('YYYY-MM-DD');
    const start = moment(`${date} ${startTime}`).toDate();
    const end = moment(`${date} ${endTime}`).toDate();

    onCreate({ 
      ...eventInfo,
      title,
      start,
      end,
      type,
      location,
      cost: parseFloat(cost) || 0,
      details
    });
  };

  const handleSave = () => {
    if (!title) {
      alert("Please enter a title.");
      return;
    }
    if (moment(endTime, 'HH:mm').isSameOrBefore(moment(startTime, 'HH:mm'))) {
      alert("End time must be after start time.");
      return;
    }
    if (!type) {
      alert("Please select an event type.");
      return;
    }

    const date = moment(eventInfo.start).format('YYYY-MM-DD');
    const start = moment(`${date} ${startTime}`).toDate();
    const end = moment(`${date} ${endTime}`).toDate();
    onSave({
      ...eventInfo,
      title,
      start,
      end,
      type,
      location,
      cost: parseFloat(cost) || 0,
      details
    });
  };

  if (!isOpen) return null;

  const eventDate = moment(eventInfo.start).format('dddd, MMMM D, YYYY');

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">
          {eventInfo?._id ? 'Edit Event' : 'Add New Event'}
        </h3>
        <p className="text-base-content/70 mb-4">{eventDate}</p>
        
        <div className="form-control w-full py-4">
          <label className="label">
            <span className="label-text">Event Title</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter event title" 
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Start Time</span>
            </label>
            <input 
              type="time" 
              className="input input-bordered w-full"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">End Time</span>
            </label>
            <input 
              type="time" 
              className="input input-bordered w-full"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-control w-full mt-4">
          <label className="label"><span className="label-text">Event Type</span></label>
          <select 
            className={`select select-bordered w-full ${!type && 'text-gray-400'}`}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option className="text-gray-400" value="" disabled>Select event type</option>
            <option value="Flight">Flight</option>
            <option value="Hotel">Hotel</option>
            <option value="Food">Food</option>
            <option value="Activity">Activity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter location" 
            className="input input-bordered w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Cost</span>
          </label>
          <input 
            type="text"
            inputMode="numeric"
            placeholder="0.00"
            className="input input-bordered w-full"
            value={"$ "+displayCost}
            onChange={(e) => {
              const input = e.target.value.replace(/\D/g, ''); // Remove non-digits
              
              if (input === '') {
                setDisplayCost('0.00');
                setCost(0);
                return;
              }
              
              // Convert to cents number and back to ensure proper formatting
              const cents = parseInt(input);
              const dollars = cents / 100;
              
              // Format as X.XX
              const formatted = dollars.toFixed(2);
              setDisplayCost(formatted);
              setCost(dollars);
            }}
            onKeyDown={(e) => {
              // Handle backspace
              if (e.key === 'Backspace') {
                e.preventDefault();
                const currentCents = Math.round(cost * 100);
                const newCents = Math.floor(currentCents / 10);
                const newDollars = newCents / 100;
                setDisplayCost(newDollars.toFixed(2));
                setCost(newDollars);
              }
            }}
          />
        </div>

        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Details</span>
          </label>
          <textarea 
            className="textarea textarea-bordered w-full" 
            placeholder="Enter event details/description"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
          />
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn">Cancel</button>
          {eventInfo?._id ? (
            <>
              <button onClick={() => onDelete(eventInfo._id)} className="btn btn-error">
                Delete
              </button>
              <button onClick={handleSave} className="btn btn-primary">
                Save
              </button>
            </>
          ) : (
            <button onClick={handleCreate} className="btn btn-primary">Add</button>
          )}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

const MembersModal = ({ isOpen, onClose, currentTrip, currentID, isOwner, onMembersUpdate }) => {
  const [members, setMembers] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const url = "http://localhost:8000";

  useEffect(() => {
    if (isOpen && currentTrip) {
      fetchMembers();
      fetchPendingInvitations();
    }
  }, [isOpen, currentTrip]);

  const fetchMembers = async () => {
    try {
      // Fetch user details for all members
      const memberPromises = currentTrip.members.map(async (memberId) => {
        const response = await fetch(url + '/profiles/id/' + memberId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        if (data.success) {
          return { ...data.profile, isOwner: memberId === currentTrip.owner };
        }
        return null;
      });

      const memberDetails = await Promise.all(memberPromises);
      setMembers(memberDetails.filter(m => m !== null));
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  const fetchPendingInvitations = async () => {
    try {
      const response = await fetch(url + '/invitations/trip/' + currentTrip._id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.success) {
        setPendingInvitations(data.invitations);
      }
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(url + '/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: currentTrip._id,
          inviter_id: currentID,
          invitee_username: username
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Invitation sent successfully!');
        setMessageType('success');
        setUsername('');
        setShowInviteForm(false);
        fetchPendingInvitations();
      } else {
        setMessage(data.message);
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Failed to send invitation');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId, memberUsername) => {
    if (!window.confirm(`Are you sure you want to remove ${memberUsername} from this trip?`)) {
      return;
    }

    try {
      const updatedMembers = currentTrip.members.filter(id => id !== memberId);
      
      const response = await fetch(url + '/calendars/' + currentTrip._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...currentTrip,
          members: updatedMembers
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`${memberUsername} removed from trip`);
        setMessageType('success');
        fetchMembers();
        onMembersUpdate(updatedMembers);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message);
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Failed to remove member');
      setMessageType('error');
    }
  };

  const handleRevokeInvitation = async (invitationId, inviteeUsername) => {
    if (!window.confirm(`Are you sure you want to revoke the invitation to ${inviteeUsername}?`)) {
      return;
    }

    try {
      const response = await fetch(url + '/invitations/' + invitationId + '/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Invitation revoked');
        setMessageType('success');
        fetchPendingInvitations();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message);
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Failed to revoke invitation');
      setMessageType('error');
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Trip Members</h3>
        <p className="text-base-content/70 mb-4">Manage members for "{currentTrip?.name}"</p>
        
        {message && (
          <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
            <span>{message}</span>
          </div>
        )}

        {/* Current Members Section */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center justify-between">
            <span>Current Members ({members.length})</span>
          </h4>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member._id} className="flex items-center justify-between bg-base-200 p-3 rounded-lg">
                <div>
                  <p className="font-medium">
                    {member.username}
                    {member.isOwner && <span className="badge badge-primary badge-sm ml-2">Owner</span>}
                  </p>
                  <p className="text-sm text-base-content/60">{member.email}</p>
                </div>
                {isOwner && !member.isOwner && (
                  <button
                    onClick={() => handleRemoveMember(member._id, member.username)}
                    className="btn btn-ghost btn-sm btn-error"
                  >
                    <TrashIcon size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invitations Section */}
        {isOwner && pendingInvitations.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Pending Invitations ({pendingInvitations.length})</h4>
            <div className="space-y-2">
              {pendingInvitations.map((invitation) => (
                <div key={invitation._id} className="flex items-center justify-between bg-warning/10 p-3 rounded-lg border border-warning/30">
                  <div>
                    <p className="font-medium">{invitation.invitee_username}</p>
                    <p className="text-sm text-base-content/60">Invitation pending</p>
                  </div>
                  <button
                    onClick={() => handleRevokeInvitation(invitation._id, invitation.invitee_username)}
                    className="btn btn-ghost btn-sm"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invite User Section */}
        {isOwner && (
          <div className="mb-4">
            {!showInviteForm ? (
              <button
                onClick={() => setShowInviteForm(true)}
                className="btn btn-primary btn-sm"
              >
                <PlusIcon size={16} />
                Invite User
              </button>
            ) : (
              <div className="bg-base-200 p-4 rounded-lg">
                <form onSubmit={handleInvite}>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Username</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter username" 
                      className="input input-bordered w-full"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
                      {isLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Send Invite'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowInviteForm(false);
                        setUsername('');
                        setMessage('');
                      }} 
                      className="btn btn-ghost btn-sm"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        <div className="modal-action">
          <button onClick={onClose} className="btn">Close</button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

const TripManagementModal = ({ isOpen, onClose, currentTrip, events, onSaveChanges, onDeleteTrip }) => {
  const [tripName, setTripName] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  useEffect(() => {
    if (currentTrip) {
      setTripName(currentTrip.name || '');
      setTripDescription(currentTrip.description || '');
      setTempStartDate(currentTrip.start);
      setTempEndDate(currentTrip.end);
    }
  }, [currentTrip, isOpen]);

  if (!isOpen) return null;

  const tripStart = moment(tempStartDate);
  const tripEnd = moment(tempEndDate);
  const duration = tripEnd.diff(tripStart, 'days') + 1;
  
  const handleAddDay = (position) => {
    if (position === 'start') {
      setTempStartDate(moment(tempStartDate).subtract(1, 'day').format('YYYY-MM-DD'));
    } else {
      setTempEndDate(moment(tempEndDate).add(1, 'day').format('YYYY-MM-DD'));
    }
  };

  const handleRemoveDay = (position) => {
    if (duration <= 1) return;
    
    if (position === 'start') {
      const dateToRemove = moment(tempStartDate);
      const eventsOnDay = events.filter(e => 
        moment(e.start).format('YYYY-MM-DD') === dateToRemove.format('YYYY-MM-DD')
      );
      
      if (eventsOnDay.length > 0 && 
          !window.confirm(`This will delete ${eventsOnDay.length} event(s) on ${dateToRemove.format('MMM D, YYYY')} when you save. Continue?`)) {
        return;
      }
      
      setTempStartDate(moment(tempStartDate).add(1, 'day').format('YYYY-MM-DD'));
    } else {
      const dateToRemove = moment(tempEndDate);
      const eventsOnDay = events.filter(e => 
        moment(e.start).format('YYYY-MM-DD') === dateToRemove.format('YYYY-MM-DD')
      );
      
      if (eventsOnDay.length > 0 && 
          !window.confirm(`This will delete ${eventsOnDay.length} event(s) on ${dateToRemove.format('MMM D, YYYY')} when you save. Continue?`)) {
        return;
      }
      
      setTempEndDate(moment(tempEndDate).subtract(1, 'day').format('YYYY-MM-DD'));
    }
  };
  
  const handleSave = () => {
    if (!tripName.trim()) {
      alert("Trip name is required.");
      return;
    }
    
    onSaveChanges({
      ...currentTrip,
      name: tripName,
      description: tripDescription,
      start: tempStartDate,
      end: tempEndDate
    });
    onClose();
  };

  const handleCancel = () => {
    // Reset to original values
    setTripName(currentTrip.name || '');
    setTripDescription(currentTrip.description || '');
    setTempStartDate(currentTrip.start);
    setTempEndDate(currentTrip.end);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${currentTrip.name}"? This will permanently delete all events in this trip.`)) {
      onDeleteTrip(currentTrip._id);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Manage Trip</h3>
        
        <div className="space-y-4">
          <div className="bg-base-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Trip Details</h4>
            
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Trip Name</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter trip name" 
                className="input input-bordered w-full"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea 
                className="textarea textarea-bordered w-full" 
                placeholder="Enter trip description"
                value={tripDescription}
                onChange={(e) => setTripDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Trip Duration</h4>
            <p className="text-2xl font-bold">{duration} days</p>
            <p className="text-sm text-base-content/70 mt-2">
              {tripStart.format('MMM D, YYYY')} - {tripEnd.format('MMM D, YYYY')}
            </p>
          </div>

          <div className="divider">Adjust Days</div>

          <div className="flex gap-4">
            <button 
              onClick={() => handleAddDay('start')}
              className="btn btn-outline flex-1"
            >
              <PlusIcon size={16}/>
              Add Day at Start
            </button>
            <button 
              onClick={() => handleAddDay('end')}
              className="btn btn-outline flex-1"
            >
              <PlusIcon size={16}/>
              Add Day at End
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => handleRemoveDay('start')}
              className="btn btn-outline btn-error flex-1"
              disabled={duration <= 1}
            >
              <TrashIcon size={16}/>
              Remove from Start
            </button>
            <button 
              onClick={() => handleRemoveDay('end')}
              className="btn btn-outline btn-error flex-1"
              disabled={duration <= 1}
            >
              <TrashIcon size={16}/>
              Remove from End
            </button>
          </div>

          {duration <= 1 && (
            <div className="alert alert-warning">
              <span className="text-sm">Trip must have at least 1 day</span>
            </div>
          )}

          <button 
            onClick={handleDelete}
            className="btn btn-error w-full"
          >
            <TrashIcon size={16} />
            Delete Trip
          </button>
        </div>

        <div className="modal-action">
          <button onClick={handleCancel} className="btn">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary">Save</button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleCancel}></div>
    </dialog>
  );
};

function Itinerary({ setCurrentPage, theme, toggleTheme, currentUser, currentID, currentTrip, onLogout }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [localTrip, setLocalTrip] = useState(currentTrip);

  const url = "http://localhost:8000";

  // Check if current user is the owner
  const isOwner = localTrip?.owner === currentID;

  useEffect(() => {
    setLocalTrip(currentTrip);
  }, [currentTrip]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(url + "/events/trip/" + localTrip._id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          const sortedEvents = data.events
            .map(event => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end)
            }))
            .sort((a, b) => a.start - b.start);
          
          setEvents(sortedEvents);
          setError(null);
        } else {
          setError(null);
          setEvents([]);
        }
      } catch (err) {
        setError('Failed to fetch events');
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (localTrip) {
      fetchEvents();
    }
  }, [localTrip, url]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await fetch(url + "/events", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          trip_id: localTrip._id,
          creator: currentID
        })
      });

      const data = await response.json();

      if (data.success) {
        const newEvent = {
          ...data.event,
          start: new Date(data.event.start),
          end: new Date(data.event.end)
        };
        setEvents(prev => [...prev, newEvent].sort((a, b) => a.start - b.start));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save event');
    }
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      const response = await fetch(url + "/events/" + eventData._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });
      const data = await response.json();
      if (data.success) {
        const updatedEvent = {
          ...data.event,
          start: new Date(data.event.start),
          end: new Date(data.event.end)
        };
        setEvents(prev => 
          prev.map(event => event._id === eventData._id ? updatedEvent : event)
            .sort((a, b) => a.start - b.start)
        );
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save event');
    }
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const response = await fetch(url + "/events/" + selectedEvent._id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.success) {
        setEvents(prev => prev.filter(event => event._id !== selectedEvent._id));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete event');
    }
    setShowModal(false);
    setSelectedEvent(null);
  };
  
  const handleUpdateTrip = async (updatedTrip) => {
    try {
      // Determine which dates were removed
      const originalStart = moment(localTrip.start);
      const originalEnd = moment(localTrip.end);
      const newStart = moment(updatedTrip.start);
      const newEnd = moment(updatedTrip.end);

      // Find events to delete (events outside the new date range)
      const eventsToDelete = events.filter(event => {
        const eventDate = moment(event.start);
        return eventDate.isBefore(newStart, 'day') || eventDate.isAfter(newEnd, 'day');
      });

      // Delete events outside the new range
      for (const event of eventsToDelete) {
        await fetch(url + "/events/" + event._id, { 
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Update events state
      setEvents(prev => prev.filter(event => {
        const eventDate = moment(event.start);
        return !eventDate.isBefore(newStart, 'day') && !eventDate.isAfter(newEnd, 'day');
      }));
      const response = await fetch(url + "/calendars/" + updatedTrip._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: updatedTrip.owner,
          name: updatedTrip.name,
          start: updatedTrip.start,
          end: updatedTrip.end,
          description: updatedTrip.description,
          members: updatedTrip.members
        })
      });

      const data = await response.json();
      if (data.success) {
        setLocalTrip(updatedTrip);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update trip');
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      const response = await fetch(url + "/calendars/" + tripId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (data.success) {
        setCurrentPage('trips');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete trip');
    }
    setShowTripModal(false);
  };

  const handleMembersUpdate = (updatedMembers) => {
    setLocalTrip(prev => ({
      ...prev,
      members: updatedMembers
    }));
  };

  const generateDayCards = () => {
    if (!localTrip?.start || !localTrip?.end) return [];
    
    const start = moment(localTrip.start);
    const end = moment(localTrip.end);
    const days = [];
    
    for (let date = start.clone(); date.isSameOrBefore(end); date.add(1, 'days')) {
      const dayEvents = events.filter(event => 
        moment(event.start).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
      );
      
      days.push({
        date: date.clone(),
        events: dayEvents
      });
    }
    
    return days;
  };

  const handleAddEvent = (date) => {
    const start = date.toDate();
    const end = moment(start).add(1, 'hour').toDate();
    setSelectedEvent({ start, end });
    setShowModal(true);
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
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">{localTrip?.name || 'Trip Itinerary'}</h1>
            <p className="text-base-content/70 mt-2">
              {moment(localTrip?.start).format('MMM D')} - {moment(localTrip?.end).format('MMM D, YYYY')}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowMembersModal(true)} 
              className="btn btn-accent gap-2"
            >
              Members
            </button>
            {isOwner && (
              <button 
                onClick={() => setShowTripModal(true)} 
                className="btn btn-primary gap-2"
              >
                Manage Trip
              </button>
            )}
            <button 
              onClick={() => setCurrentPage('trips')} 
              className="btn btn-ghost"
            >
              Back to Trips
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error max-w-2xl mx-auto my-8">
            <span>{error}</span>
          </div>
        ) : (
          <div className="overflow-x-auto flex gap-6 pl-6 pr-6 pb-6 snap-x snap-mandatory">
            {generateDayCards().map(({ date, events: dayEvents }) => (
              <div 
                key={date.format('YYYY-MM-DD')}
                className="card bg-base-100 shadow-xl min-w-[320px] snap-center hover:shadow-2xl transition-shadow"
              >
                <div className="card-body p-6">
                  <h2 className="card-title justify-between">
                    <div>
                      <div className="text-lg font-bold">{date.format('ddd, MMM D')}</div>
                      <div className="text-sm font-normal text-base-content/60">
                        Day {date.diff(moment(localTrip.start), 'days') + 1}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddEvent(date)}
                      className="btn btn-circle btn-sm btn-primary"
                    >
                      <PlusIcon size={16}/>
                    </button>
                  </h2>
                  
                  {dayEvents.length === 0 ? (
                    <div className="text-center py-8 text-base-content/50">
                      No events planned
                    </div>
                  ) : (
                    <div className="space-y-3 mt-4">
                      {dayEvents.map((event, index) => (
                        <div 
                          key={event._id || index}
                          onClick={() => handleSelectEvent(event)}
                          className={`card ${getEventColor(event.type)} border-2 cursor-pointer transition-all`}
                        >
                          <div className="card-body p-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {getEventIcon(event.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-neutral leading-tight">{event.title}</h3>
                                <p className="text-sm text-neutral/60 mt-1">
                                  {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
                                </p>
                                {event.location && (
                                  <p className="text-xs text-neutral/60 mt-1">{event.location}</p>
                                )}
                                {event.cost > 0 && (
                                  <p className="text-xs text-neutral/60 mt-1">${event.cost.toFixed(2)}</p>
                                )}
                                {event.details && (
                                  <p className="text-xs text-neutral/70 line-clamp-2 mt-1">{event.details}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEvent(null);
        }}
        onCreate={handleCreateEvent}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        eventInfo={selectedEvent}
      />

      <TripManagementModal
        isOpen={showTripModal}
        onClose={() => setShowTripModal(false)}
        currentTrip={localTrip}
        events={events}
        onSaveChanges={handleUpdateTrip}
        onDeleteTrip={handleDeleteTrip}
      />

      <MembersModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        currentTrip={localTrip}
        currentID={currentID}
        isOwner={isOwner}
        onMembersUpdate={handleMembersUpdate}
      />
    </div>
  );
}

export default Itinerary;