from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://TripSync:1a2qYb9vOavPeMtw@tripsync.kl0if1g.mongodb.net/")
client = MongoClient(MONGO_URI)
db = client["Logins"]
users = db["Accounts"]

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

@app.get("/logins")
def get_logins():
    # Fetch all documents from the Accounts collection
    logins = list(users.find({}, {"_id": 0}))  # exclude MongoDB's _id field
    return {"logins": logins}

@app.post("/signup")
async def signup(request: Request):
    data = await request.json()  # Get JSON data from frontend
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return {"success": False, "message": "Username and password are required."}

    # Check if username already exists
    if users.find_one({"username": username}):
        return {"success": False, "message": "Username already exists."}

    # Insert new user
    users.insert_one({"username": username, "password": password})
    return {"success": True, "message": "Signup successful!"}