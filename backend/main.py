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

class EventCreate(BaseModel):
    title: str
    date: datetime.datetime
    venue: str
    location: str
    totalSeats: int = 100

class UserCreate(BaseModel):
    name: str = None
    email: str = None
    phone: str = None
    role: str = "USER"

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

@app.get("/api/events")
def get_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()

@app.post("/api/events")
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    import uuid
    new_event = models.Event(
        id=str(uuid.uuid4()),
        title=event.title,
        date=event.date,
        venue=event.venue,
        location=event.location,
        totalSeats=event.totalSeats,
        availableSeats=event.totalSeats
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.post("/api/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    import uuid
    new_user = models.User(
        id=str(uuid.uuid4()),
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
