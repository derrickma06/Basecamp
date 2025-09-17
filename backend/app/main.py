from fastapi import FastAPI
from pymongo import MongoClient
import os

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
client = MongoClient(MONGO_URI)
db = client["mydatabase"]

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI + MongoDB"}
