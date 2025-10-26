from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import date
import os

# Create Pydantic models for request validation
class UserCredentials(BaseModel):
    firstName: str
    lastName: str
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

class Profile(BaseModel):
    old_username: str
    username: str
    email: str
    firstName: str
    lastName: str
    date_created: str

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
    firstName = profile.firstName
    lastName = profile.lastName

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
            "firstName": firstName,
            "lastName": lastName
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
    firstName = credentials.firstName
    lastName = credentials.lastName
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
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "date_created": str(date_created)
    })

    return {"success": True, "message": "Signup successful!", "id": str(result.inserted_id)}

@app.get("/calendars/{id}")
async def get_calendars(id: str):    
    # Find all calendar documents associated with the username
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

@app.post("/update-password")
async def update_password(password_data: PasswordUpdate):
    username = password_data.username
    current_password = password_data.currentPassword
    new_password = password_data.newPassword

    # Find the user
    user = users.find_one({"username": username})
    
    if not user:
        return {"success": False, "message": "User not found"}
    
    # Verify current password
    if user["password"] != current_password:
        return {"success": False, "message": "Current password is incorrect"}
    
    # Update the password
    result = users.update_one(
        {"username": username},
        {"$set": {"password": new_password}}
    )
    
    if result.modified_count == 1:
        return {"success": True, "message": "Password updated successfully"}
    else:
        return {"success": False, "message": "Failed to update password"}