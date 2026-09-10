from datetime import datetime
from typing import Dict, Any, List

# In-memory storage for active leads and conversation logs
LEADS_DB: List[Dict[str, Any]] = []

class WhatsAppSimulator:
    """
    Simulates Meta WhatsApp Cloud API Webhooks & Outbound Drip Workflows.
    """
    
    @staticmethod
    def process_inbound(sender_name: str, phone: str, message: str, spec: Dict[str, Any], score_info: Dict[str, Any]) -> Dict[str, Any]:
        lead_id = f"LEAD-{len(LEADS_DB) + 101}"
        timestamp = datetime.now().strftime("%I:%M %p, %d %b %Y")
        
        lead_record = {
            "lead_id": lead_id,
            "sender_name": sender_name,
            "phone": phone,
            "timestamp": timestamp,
            "raw_message": message,
            "spec": spec,
            "score": score_info["score"],
            "status": score_info["status"],
            "badge_color": score_info["badge_color"],
            "automated_action": score_info["automated_action"],
            "reasons": score_info["scoring_reasons"],
            "conversation_history": [
                {"sender": sender_name, "type": "inbound", "text": message, "time": timestamp},
                {"sender": "ArchEngine AI (Bot)", "type": "outbound", "text": f"✅ Project Brief Card Created ({lead_id}). Workflow: {score_info['automated_action']}", "time": timestamp}
            ]
        }
        
        LEADS_DB.insert(0, lead_record)
        return lead_record

    @staticmethod
    def get_all_leads() -> List[Dict[str, Any]]:
        return LEADS_DB
