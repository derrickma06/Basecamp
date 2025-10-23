from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import date
import os

# Create Pydantic models for request validation
class UserCredentials(BaseModel):
    username: str
    password: str

class Trip(BaseModel):
    username: str
    name: str
    start: str
    end: str
    description: str

class Profile(BaseModel):
    old_username: str
    username: str
    email: str
    date_created: str

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

    if not username:
        raise HTTPException(status_code=400, detail="Username is required.")
    
    # Check if the new username already exists (and is different from the old one)
    if users.find_one({"username": username}):
        return {"success": False, "message": "Username already exists."}
    
    # Update the user's profile in the database
    result = users.update_one(
        {"username": old_username},
        {"$set": {"username": username, "email": email}}
    )
    
    if result.matched_count == 0:
        return {"success": False, "message": "User not found."}
    
    return {"success": True, "message": "Profile updated successfully."}

@app.post("/login")
async def login(credentials: UserCredentials):
    username = credentials.username
    password = credentials.password

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required.")

    # Find the user in the database
    user = users.find_one({"username": username})

    # Check if user exists and password is correct
    if user and user["password"] == password:
        return {"success": True, "message": "Login successful!"}
    
    return {"success": False, "message": "Invalid username or password."}

@app.post("/signup")
async def signup(credentials: UserCredentials):
    username = credentials.username
    password = credentials.password
    date_created = date.today()

    if not username or not password:
        return {"success": False, "message": "Username and password are required."}

    # Check if username already exists
    if users.find_one({"username": username}):
        return {"success": False, "message": "Username already exists."}

    # Insert new user
    users.insert_one({"username": username, "password": password, "email": "", "date_created": str(date_created)})
    return {"success": True, "message": "Signup successful!"}

@app.get("/calendars/{username}")
async def get_calendars(username: str):
    if not username:
        raise HTTPException(status_code=400, detail="Username is required.")
    
    # Find all calendar documents associated with the username
    user_calendars = list(calendars.find({"username": username}))
    
    # Convert ObjectId to string for JSON serialization
    for calendar in user_calendars:
        calendar["_id"] = str(calendar["_id"])
    
    if user_calendars:
        return {"success": True, "calendars": user_calendars}
    
    return {"success": False, "calendars": []}

@app.post("/calendars")
async def create_calendar(trip: Trip):
    if not trip.username:
        raise HTTPException(status_code=400, detail="Username is required.")
    
    # Create new calendar document
    new_trip = {
        "username": trip.username,
        "name": trip.name,
        "start": trip.start,
        "end": trip.end,
        "description": trip.description
    }
    
    result = calendars.insert_one(new_trip)
    
    # Get the created document and return it
    created_trip = calendars.find_one({"_id": result.inserted_id})
    created_trip["_id"] = str(created_trip["_id"])
    
    return {"success": True, "calendar": created_trip}


@app.post("/events")
async def events(request: Request):
    data = await request.json()
    calendar_id = data.get("calendar_id")
    
    if not calendar_id:
        raise HTTPException(status_code=400, detail="Calendar ID is required.")
    
    # Find all event documents associated with the calendar_id
    calendar_events = list(events.find({"calendar": calendar_id}))
    
    # Convert ObjectId to string for JSON serialization
    for event in calendar_events:
        event["_id"] = str(event["_id"])
    
    if calendar_events:
        return {"success": True, "events": calendar_events}
    
    return {"success": False, "message": "No events found for this calendar."}
