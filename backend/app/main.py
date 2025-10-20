from fastapi import FastAPI, Request, HTTPException
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

@app.post("/login")
async def login(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required.")

    # Find the user in the database
    user = users.find_one({"username": username})

    # Check if user exists and password is correct
    if user and user["password"] == password:
        return {"success": True, "message": "Login successful!"}
    
    return {"success": False, "message": "Invalid username or password."}

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