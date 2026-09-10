from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import os

from app.ai_extractor import ArchSpecExtractor
from app.scoring import LeadScorer
from app.whatsapp_sim import WhatsAppSimulator

app = FastAPI(
    title="ArchSpec AutoLead Engine (AS-05 + AS-03)",
    description="Intelligent Lead Qualification & Architectural Spec Collector for ArchDesign Studios",
    version="1.0.0"
)

# Serve Static files
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

class InboundMessageRequest(BaseModel):
    sender_name: str
    phone: str
    message: str

# Seed initial realistic demo leads
@app.on_event("startup")
def seed_demo_data():
    demo_msgs = [
        {
            "sender_name": "Rohan Malhotra",
            "phone": "+91-9876543210",
            "message": "Hi, I have a 3BHK 1800 sq ft apartment in HSR Layout Bangalore. Looking for full luxury interior design with Italian marble. Budget around 30 Lakhs, want to start immediately within 1 month."
        },
        {
            "sender_name": "Ananya Sharma",
            "phone": "+91-9123456789",
            "message": "Hello, need quote for 2500 sqft boutique cafe interior design in Indiranagar. Budget around 45L. Modern industrial theme."
        },
        {
            "sender_name": "Vikram Patel",
            "phone": "+91-9988776655",
            "message": "Need interior quote."
        }
    ]
    for msg in demo_msgs:
        spec = ArchSpecExtractor.extract_spec(msg["message"])
        score_info = LeadScorer.calculate_score(spec)
        WhatsAppSimulator.process_inbound(msg["sender_name"], msg["phone"], msg["message"], spec, score_info)

@app.get("/", response_class=HTMLResponse)
async def get_dashboard():
    index_path = os.path.join(static_dir, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        return f.read()

@app.post("/api/inbound-lead")
async def process_inbound_lead(req: InboundMessageRequest):
    spec = ArchSpecExtractor.extract_spec(req.message)
    score_info = LeadScorer.calculate_score(spec)
    record = WhatsAppSimulator.process_inbound(req.sender_name, req.phone, req.message, spec, score_info)
    return JSONResponse(content={"status": "success", "lead": record})

@app.get("/api/leads")
async def get_leads():
    return JSONResponse(content={"leads": WhatsAppSimulator.get_all_leads()})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8005, reload=True)
