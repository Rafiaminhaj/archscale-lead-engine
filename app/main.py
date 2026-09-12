from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import os

from app.ai_extractor import ArchSpecExtractor
from app.scoring import LeadScorer
from app.whatsapp_sim import WhatsAppSimulator
from app.tuya_automation import TuyaSmartAutomation

app = FastAPI(
    title="ArchSpec AutoLead Engine (AS-05 + AS-03) + Tuya IoT",
    description="Intelligent Lead Qualification & Architectural Spec Collector for ArchDesign Studios with Tuya IoT Cloud Automation",
    version="1.1.0"
)

# Serve Static files safely for Vercel Serverless
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if not os.path.exists(static_dir):
    static_dir = os.path.join(os.getcwd(), "static")

if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

class InboundMessageRequest(BaseModel):
    sender_name: str
    phone: str
    message: str

# Seed initial realistic demo leads at module load time
def seed_demo_data():
    if len(WhatsAppSimulator.get_all_leads()) == 0:
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
            },
            {
                "sender_name": "Neha Gupta",
                "phone": "+91-9876500112",
                "message": "Hi, I need interior design for my 2BHK flat in Whitefield Bangalore. Budget around 20 lakhs, not sure about the exact area yet."
            }
        ]
        for msg in demo_msgs:
            spec = ArchSpecExtractor.extract_spec(msg["message"])
            score_info = LeadScorer.calculate_score(spec)
            WhatsAppSimulator.process_inbound(msg["sender_name"], msg["phone"], msg["message"], spec, score_info)

seed_demo_data()

@app.get("/", response_class=HTMLResponse)
async def get_dashboard():
    paths_to_try = [
        os.path.join(static_dir, "index.html"),
        os.path.join(os.path.dirname(__file__), "..", "static", "index.html"),
        os.path.join(os.getcwd(), "static", "index.html"),
        "static/index.html"
    ]
    for p in paths_to_try:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                return f.read()
    return "<h1>ArchSpec AutoLead Engine + Tuya AIoT</h1><p>Dashboard loaded successfully.</p>"

@app.post("/api/inbound-lead")
async def process_inbound_lead(req: InboundMessageRequest):
    spec = ArchSpecExtractor.extract_spec(req.message)
    score_info = LeadScorer.calculate_score(spec)
    record = WhatsAppSimulator.process_inbound(req.sender_name, req.phone, req.message, spec, score_info)
    tuya_alert = TuyaSmartAutomation.trigger_studio_alert(record)
    return JSONResponse(content={"status": "success", "lead": record, "tuya_iot_event": tuya_alert})

@app.get("/api/leads")
async def get_leads():
    return JSONResponse(content={"leads": WhatsAppSimulator.get_all_leads()})

@app.get("/api/tuya-status")
async def get_tuya_status():
    return JSONResponse(content={
        "status": "connected",
        "provider": "Tuya IoT Open Cloud Platform",
        "device_id": TuyaSmartAutomation.TUYA_DEVICE_ID,
        "mode": "Realtime Studio Lighting & HVAC Trigger"
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8005, reload=True)
