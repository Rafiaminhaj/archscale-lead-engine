# 🏛️ ArchSpec AutoLead Engine
> **ArchScale Guild Intern Technology Hackathon Submission**  
> **Target Challenges:** `AS-05 — Build the marketing machine` (Primary) + `AS-03 — Voice Command Execution` (Secondary)  
> **Applicant:** Rafia Minhaj (`rafiaminhaj423@gmail.com`)  
> **Registration ID:** `REG-9FE9C39B`  

![ArchSpec AutoLead Engine UI Banner](assets/banner.png)

---

## 🎯 1. 3-Tier Automated Triage & Scoring Rubric

### 📊 Transparent Scoring Allocation (Judges Rubric)
`Scoring Rubric: Budget (25) > Area (20) > Scope (15) > Timeline (10-15) > Base (20). Hot ≥ 80 auto-dispatches to architect.`

| Metric | Max Points | Evaluation Criteria |
| :--- | :--- | :--- |
| **Base Touchpoint** | `+20 pts` | Verified Inbound Ingestion Channel |
| **Budget Tier** | `+25 pts` | Clear Budget Range Specified (e.g. ₹35L, ₹1.5 Cr) |
| **Carpet Area** | `+20 pts` | Specific Carpet Area (e.g. 2200 sq ft) |
| **Property Scope** | `+15 pts` | Penthouse, Apartment, Villa, Commercial |
| **Timeline / Urgency** | `+15 pts` | Start Date (< 1 Month, Immediate, 2-3 Months) |

### ⚡ 3-Tier Automated Triage Routing
1. **🔥 HOT LEAD (`Score >= 80`):** Auto-dispatches instant WhatsApp Project Brief Card to Principal Architect.
2. **⚡ WARM LEAD (`Score 40 - 79`):** Routes to Studio Human Review Queue & triggers interactive spec questionnaire.
3. **💬 COLD / VAGUE (`Score < 40`):** Enrolls in automated nurture drip campaign.

---

## 🏗️ System Architecture & Workflow Diagram

```mermaid
graph TD
    A[Unstructured WhatsApp / Web Message] -->|Inbound Webhook| B[FastAPI API Gateway]
    B --> C[ArchSpec AI Extractor Engine]
    
    subgraph AI Extraction Core
        C --> D[Carpet Area Extractor sq ft]
        C --> E[Budget Tier Classifier ₹]
        C --> F[Timeline & Urgency Detector]
        C --> G[Design Style Classifier]
    end
    
    D --> H[Machine-Readable Project Brief Card]
    E --> H
    F --> H
    G --> H
    
    H --> I[3-Tier Triage Engine 0-100]
    
    I -->|Score >= 80| J[🔥 HOT LEAD: Instant WhatsApp Brief to Principal Architect]
    I -->|Score 40-79| K[⚡ WARM LEAD: Studio Human Review Queue]
    I -->|Score < 40| L[💬 COLD / VAGUE: Nurture Campaign]
    
    M[🎙️ Web Speech API AS-03 Voice Command] -->|Voice to Action| B
```

---

## 💡 2. The Solution: One Intelligent Micro-Workflow
Rather than building another generic CRUD CRM dashboard or basic AI chatbot wrapper, **ArchSpec AutoLead Engine** implements a sharp **Architectural Specification Collector & Workflow Automation Engine**.

### Core Capabilities:
- 📩 **WhatsApp Webhook Ingestion:** Ingests raw client text messages in real-time.
- 🧠 **AI Architectural Spec Collector:** Automatically handles typos (`2200sqft`) and budget ranges (`30-35L`).
- 📋 **Machine-Readable Project Brief Card:** Instantly generates a structured 1-page Project Brief Card with printable PDF modal.
- 🎯 **3-Tier Lead Intent Triage (0-100):** Transparent scoring & triage routing.
- 🎙️ **Voice Command Integration (AS-03):** Speech-to-command execution (`"Show hot leads"`).

---

## 🛠️ 3. Architecture & Tech Stack
- **Backend Core:** Python 3.13 + FastAPI + Pydantic
- **AI Core:** RegEx/NLP Architectural Specification Extractor & Lead Scoring Engine
- **Frontend UI:** Glassmorphism Dark Theme (HTML5, Vanilla CSS3, JavaScript ES6)
- **Deployment:** Live Production on Vercel Serverless (`https://archscale-lead-engine.vercel.app`)

---

## 🚀 4. How to Run Locally

```bash
# Clone the repository
git clone https://github.com/Rafiaminhaj/archscale-lead-engine.git
cd archscale-lead-engine

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8005 --reload
```
