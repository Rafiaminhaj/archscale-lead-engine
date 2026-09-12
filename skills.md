# 🤖 ArchScale Lead Engine Skills Matrix (skills.md)

> Official Open-Source AI Agent Skill Specification for **Hacktoberfest 2026**.

## 📌 Agent Identity
- **Agent Name:** ArchScale AutoLead Agent
- **Core Stack:** Python 3.11, FastAPI, Google Gemini 3.7 Flash AI, Tuya IoT Cloud Webhooks
- **Primary Domain:** Architectural Project Brief Extraction, Lead Scoring, Real-time Hardware Lighting Automation

---

## ⚡ Core Skills & Tools

### 1. Architectural Intent & Budget Parsing (`skill_gemini_parser`)
- **Description:** Extracts property scope, carpet area, budget tier, and timeline from unstructured client WhatsApp messages.
- **AI Model:** Google Gemini 3.7 Flash API.

### 2. 3-Tier Lead Scoring Rubric (`skill_lead_scoring`)
- **Description:** Evaluates leads from 0 to 100 based on budget tier, area, scope, and timeline.

### 3. Tuya IoT Hardware Lighting Actuation (`skill_tuya_lighting`)
- **Description:** Triggers sub-500ms REST webhooks to actuate smart studio LED lighting (Emerald Green `#00FF00` for Hot Leads).

---

## 🛠️ How to Extend / Contribute
1. Add new WhatsApp message presets in `static/js/app.js`.
2. Add new IoT device triggers in `app/tuya_automation.py`.
3. Submit a Pull Request under **Hacktoberfest 2026**!
