from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pymongo import MongoClient
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MIMEMultipart
import hashlib
from datetime import datetime
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['edi']  # Database name: 'edi'

# Collections
contacts_collection = db['contacts']
jobs_collection = db['jobs']
qna_collection = db['qna']

# Admin credentials (hashed)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = hashlib.sha256("admin".encode()).hexdigest()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

def send_email(to_email, subject, body):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MimeText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

def create_access_token(data: dict, expires_delta: Optional[int] = None):
    to_encode = data.copy()
    if expires_delta:
        to_encode.update({"exp": datetime.utcnow().timestamp() + expires_delta * 60})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None or username != ADMIN_USERNAME:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

# Pydantic models
class User(BaseModel):
    username: str
    password: str

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: str
    message: str
    type: Optional[str] = "info"

class Job(BaseModel):
    title: str
    company: str
    location: str
    type: str
    experience: str
    desc: str
    email: Optional[str] = ""

class Qna(BaseModel):
    q: str
    a: str

# Login endpoint
@app.post("/token")
async def login(form_data: User):
    password_hash = hashlib.sha256(form_data.password.encode()).hexdigest()
    if form_data.username == ADMIN_USERNAME and password_hash == ADMIN_PASSWORD_HASH:
        access_token = create_access_token(data={"sub": ADMIN_USERNAME}, expires_delta=ACCESS_TOKEN_EXPIRE_MINUTES)
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Incorrect username or password")

# Contact form submission
@app.post("/api/contact")
async def submit_contact(contact: ContactRequest):
    contact_data = contact.dict()
    contact_data["timestamp"] = datetime.utcnow()
    
    result = contacts_collection.insert_one(contact_data)
    
    request_type = contact_data.get('type', 'info')
    subject = f"New {request_type.upper()} Request from {contact_data['name']}"
    body = f"""
    Name: {contact_data['name']}
    Email: {contact_data['email']}
    Phone: {contact_data['phone']}
    Message: {contact_data['message']}
    Type: {request_type}
    Timestamp: {contact_data['timestamp']}
    """
    
    email_sent = send_email(SENDER_EMAIL, subject, body)
    print(f"Email sent: {email_sent}, Inserted ID: {result.inserted_id}")
    
    if email_sent and result.acknowledged:
        return {"success": True, "message": "Request submitted successfully"}
    raise HTTPException(status_code=500, detail="Error submitting request")

# Get all contacts (admin only)
@app.get("/api/contacts")
async def get_contacts(current_user: str = Depends(get_current_user)):
    contacts = list(contacts_collection.find().sort("timestamp", -1))
    for contact in contacts:
        contact["_id"] = str(contact["_id"])
    return contacts

# Jobs CRUD
@app.get("/api/jobs")
async def get_jobs():
    jobs = list(jobs_collection.find())
    for job in jobs:
        job["_id"] = str(job["_id"])
        job["id"] = job.get("id", str(job["_id"]))  # Ensure id for frontend
    return jobs

@app.post("/api/jobs")
async def add_job(job: Job, current_user: str = Depends(get_current_user)):
    job_data = job.dict()
    job_data["id"] = str(datetime.utcnow().timestamp())
    job_data["timestamp"] = datetime.utcnow()
    result = jobs_collection.insert_one(job_data)
    job_data["_id"] = str(result.inserted_id)
    return {"success": True, "job": job_data}

@app.delete("/api/jobs/{job_id}")
async def delete_job(job_id: str, current_user: str = Depends(get_current_user)):
    result = jobs_collection.delete_one({"_id": job_id})
    if result.deleted_count > 0:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Job not found")

# Q&A CRUD
@app.get("/api/qna")
async def get_qna():
    qna = list(qna_collection.find())
    for item in qna:
        item["_id"] = str(item["_id"])
        item["id"] = item.get("id", str(item["_id"]))
    return qna

@app.post("/api/qna")
async def add_qna(qna_item: Qna, current_user: str = Depends(get_current_user)):
    qna_data = qna_item.dict()
    qna_data["id"] = str(datetime.utcnow().timestamp())
    qna_data["timestamp"] = datetime.utcnow()
    result = qna_collection.insert_one(qna_data)
    qna_data["_id"] = str(result.inserted_id)
    return {"success": True, "qna": qna_data}

@app.put("/api/qna/{qna_id}")
async def update_qna(qna_id: str, qna_item: Qna, current_user: str = Depends(get_current_user)):
    result = qna_collection.update_one({"_id": qna_id}, {"$set": qna_item.dict()})
    if result.modified_count > 0:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Q&A not found")

@app.delete("/api/qna/{qna_id}")
async def delete_qna(qna_id: str, current_user: str = Depends(get_current_user)):
    result = qna_collection.delete_one({"_id": qna_id})
    if result.deleted_count > 0:
        return {"success": True}
    raise HTTPException(status_code=404, detail="Q&A not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)