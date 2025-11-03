from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import date
import os

# Create Pydantic models for request validation
class UserCredentials(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password: str

class LoginCredentials(BaseModel):
    username: str
    password: str

class Trip(BaseModel):
    owner: str
    name: str
    start: str
    end: str
    description: str
    members: list

class Event(BaseModel):
    calendarId: str
    name: str
    date: str
    startTime: str
    endTime: str
    description: str
    location: str
    creator: str

class Profile(BaseModel):
    old_username: str
    username: str
    email: str
    first_name: str
    last_name: str
    date_created: str

class Event(BaseModel):
    trip_id: str
    creator: str
    title: str
    start: str
    end: str
    type: str
    location: str
    cost: float
    details: str

class PasswordUpdate(BaseModel):
    username: str
    currentPassword: str
    newPassword: str

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://TripSync:1a2qYb9vOavPeMtw@tripsync.kl0if1g.mongodb.net/")
client = MongoClient(MONGO_URI)
logins = client["Logins"]
users = logins["Accounts"]
trips = client["Trips"]
calendars = trips["Calendars"]
events = trips["Events"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI + MongoDB"}

@app.get("/profiles/{username}")
async def get_profile(username: str):
    if not username:
        raise HTTPException(status_code=400, detail="Username is required.")
    
    # Find the user in the database
    user = users.find_one({"username": username})
    
    if user:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string for JSON serialization
        return {"success": True, "profile": user}
    
    return {"success": False, "message": "User not found."}

@app.post("/profiles")
async def update_profile(profile: Profile):
    old_username = profile.old_username
    username = profile.username
    email = profile.email
    first_name = profile.first_name
    last_name = profile.last_name

    if not username:
        return {"success": False, "message": "Username is required."}
    
    # Check if the new username already exists and is different from the old one)
    if users.find_one({"username": username}) and username != old_username:
        return {"success": False, "message": "Username already exists."}
    
    if email != "" and users.find_one({"email": email, "username": {"$ne": old_username}}):
        return {"success": False, "message": "Email already in use."}

    # Update the user's profile in the database
    result = users.update_one(
        {"username": old_username},
        {"$set": {
            "username": username,
            "email": email,
            "first_name": first_name,
            "last_name": last_name
        }}
    )
    
    if result.matched_count == 0:
        return {"success": False, "message": "User not found."}
    
    return {"success": True, "message": "Profile updated successfully."}

@app.post("/login")
async def login(credentials: LoginCredentials):
    username = credentials.username
    password = credentials.password

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required.")

    # Find the user in the database
    user = users.find_one({"username": username})

    # Check if user exists and password is correct
    if user and user["password"] == password:
        return {"success": True, "message": "Login successful!", "id": str(user["_id"])}
    
    return {"success": False, "message": "Invalid username or password."}

@app.post("/signup")
async def signup(credentials: UserCredentials):
    first_name = credentials.first_name
    last_name = credentials.last_name
    username = credentials.username
    password = credentials.password
    email = credentials.email
    date_created = date.today()

    if not username or not password:
        return {"success": False, "message": "Username and password are required."}

    # Check if username already exists
    if users.find_one({"username": username}):
        return {"success": False, "message": "Username already exists."}
    
    # Check if email already exists
    if users.find_one({"email": email}):
        return {"success": False, "message": "Email already exists."}

    # Insert new user
    result = users.insert_one({
        "username": username,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "date_created": str(date_created)
    })

    return {"success": True, "message": "Signup successful!", "id": str(result.inserted_id)}

@app.get("/calendars/{id}")
async def get_calendars(id: str):    
    # Find all calendar documents associated with the user id
    user_calendars = list(calendars.find({"owner": id}))
    
    # Convert ObjectId to string for JSON serialization
    for calendar in user_calendars:
        calendar["_id"] = str(calendar["_id"])
    
    if user_calendars:
        return {"success": True, "calendars": user_calendars}
    
    return {"success": False, "calendars": []}

@app.post("/calendars")
async def create_calendar(trip: Trip): 
    # Create new calendar document
    new_trip = {
        "owner": trip.owner,
        "name": trip.name,
        "start": trip.start,
        "end": trip.end,
        "description": trip.description,
        "members": trip.members
    }
    
    result = calendars.insert_one(new_trip)
    
    # Get the created document and return it
    created_trip = calendars.find_one({"_id": result.inserted_id})
    created_trip["_id"] = str(created_trip["_id"])
    
    return {"success": True, "calendar": created_trip}

@app.put("/calendars/{id}")
async def update_calendar(id: str, trip: Trip):
    from bson import ObjectId
    update_data = {
        "owner": trip.owner,
        "name": trip.name,
        "start": trip.start,
        "end": trip.end,
        "description": trip.description,
        "members": trip.members
    }
    result = calendars.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.matched_count == 1:
        updated_trip = calendars.find_one({"_id": ObjectId(id)})
        updated_trip["_id"] = str(updated_trip["_id"])
        return {"success": True, "calendar": updated_trip}
    return {"success": False, "message": "Calendar not found."}

@app.delete("/calendars/{id}")
async def delete_calendar(id: str):
    from bson import ObjectId
    result = calendars.delete_one({"_id": ObjectId(id)})

    trip_events = list(events.find({"trip_id": id}))
    for event in trip_events:
        events.delete_one({"_id": ObjectId(event["_id"])})

    if result.deleted_count == 1:
        return {"success": True, "message": "Trip deleted successfully."}
    return {"success": False, "message": "Trip not found."}

@app.post("/events")
async def create_event(event: Event):
    new_event = {
        "trip_id": event.trip_id,
        "creator": event.creator,
        "title": event.title,
        "start": event.start,
        "end": event.end,
        "type": event.type,
        "location": event.location,
        "cost": event.cost,
        "details": event.details
    }
    result = events.insert_one(new_event)

    created_event = events.find_one({"_id": result.inserted_id})
    created_event["_id"] = str(created_event["_id"])
    return {"success": True, "event": created_event}

@app.get("/events/trip/{trip_id}")
async def get_events(trip_id: str):
    # Find all event documents associated with the trip_id
    trip_events = list(events.find({"trip_id": trip_id}))
    
    # Convert ObjectId to string for JSON serialization
    for event in trip_events:
        event["_id"] = str(event["_id"])
    
    if trip_events:
        return {"success": True, "events": trip_events}
    
    return {"success": False, "message": "No events found for this trip."}

@app.delete("/events/{event_id}")
async def delete_event(event_id: str):
    from bson import ObjectId
    result = events.delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count == 1:
        return {"success": True, "message": "Event deleted successfully."}
    return {"success": False, "message": "Event not found."}

@app.put("/events/{event_id}")
async def update_event(event_id: str, event: Event):
    from bson import ObjectId
    update_data = {
        "trip_id": event.trip_id,
        "creator": event.creator,
        "title": event.title,
        "start": event.start,
        "end": event.end,
        "type": event.type,
        "location": event.location,
        "cost": event.cost,
        "details": event.details
    }
    result = events.update_one({"_id": ObjectId(event_id)}, {"$set": update_data})
    if result.matched_count == 1:
        updated_event = events.find_one({"_id": ObjectId(event_id)})
        updated_event["_id"] = str(updated_event["_id"])
        return {"success": True, "event": updated_event}
    return {"success": False, "message": "Event not found."}
