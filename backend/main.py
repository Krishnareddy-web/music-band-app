from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dappu Srinu API")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, change to actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BookingCreate(BaseModel):
    userId: str
    eventId: str
    favoriteSongs: str = None

@app.get("/")
def read_root():
    return {"message": "Welcome to Dappu Srinu Python API"}

@app.get("/api/bookings")
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).all()
    return bookings

@app.post("/api/bookings")
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    import uuid
    new_booking = models.Booking(
        id=str(uuid.uuid4()),
        userId=booking.userId,
        eventId=booking.eventId,
        favoriteSongs=booking.favoriteSongs
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
