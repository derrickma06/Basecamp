from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
client = MongoClient(MONGO_URI)
db = client["mydatabase"]

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
