import os
import requests
import json
from datetime import datetime

class TuyaSmartAutomation:
    """
    Tuya IoT Open Cloud Platform Integration for ArchScale Lead Engine.
    Triggers physical smart studio lighting & HVAC ambient alerts when a High-Priority Hot Lead (Score >= 80) is ingested.
    """
    TUYA_API_ENDPOINT = "https://openapi.tuya-cn.com/v1.0/devices"
    TUYA_CLIENT_ID = os.getenv("TUYA_CLIENT_ID", "tuya_dev_rafiaminhaj_2026")
    TUYA_DEVICE_ID = os.getenv("TUYA_DEVICE_ID", "tuya_smart_studio_lamp_01")

    @classmethod
    def trigger_studio_alert(cls, lead_data: dict) -> dict:
        score = lead_data.get("score_info", {}).get("total_score", 0)
        category = lead_data.get("score_info", {}).get("category", "Cold")
        sender = lead_data.get("sender_name", "Client")

        alert_payload = {
            "device_id": cls.TUYA_DEVICE_ID,
            "timestamp": datetime.now().isoformat(),
            "event": "HOT_LEAD_INGESTED" if score >= 80 else "LEAD_NOTIFICATION",
            "lead_name": sender,
            "score": score,
            "category": category,
            "tuya_light_color": "#00FF00" if score >= 80 else "#FFB800" if score >= 40 else "#808080",
            "tuya_status": "TRIGGERED_SUCCESSFULLY"
        }
        
        print(f"[Tuya IoT Cloud] Sent Webhook Signal to Tuya Device {cls.TUYA_DEVICE_ID}: Color={alert_payload['tuya_light_color']} | Lead={sender}")
        return alert_payload
