from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "User"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    password = Column(String, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    role = Column(String, default="USER")
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Event(Base):
    __tablename__ = "Event"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=True)
    date = Column(DateTime)
    venue = Column(String)
    location = Column(String)
    totalSeats = Column(Integer, default=100)
    availableSeats = Column(Integer, default=100)
    status = Column(String, default="OPEN")
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Booking(Base):
    __tablename__ = "Booking"

    id = Column(String, primary_key=True, index=True)
    userId = Column(String, ForeignKey("User.id", ondelete="CASCADE"))
    eventId = Column(String, ForeignKey("Event.id", ondelete="CASCADE"))
    status = Column(String, default="PENDING")
    favoriteSongs = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="bookings")
    event = relationship("Event", back_populates="bookings")

User.bookings = relationship("Booking", back_populates="user")
Event.bookings = relationship("Booking", back_populates="event")
