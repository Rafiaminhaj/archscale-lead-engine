from typing import Dict, Any

class LeadScorer:
    """
    Lead Intent & Qualification Scoring Engine.
    Evaluates extracted architectural parameters to assign a 0-100 score and automated workflow action.
    """
    
    @staticmethod
    def calculate_score(spec: Dict[str, Any]) -> Dict[str, Any]:
        score = 40  # Base score for reaching out
        reasons = []

        # 1. Budget Score (Up to +25)
        budget = spec.get("budget", "")
        if "Crore" in budget:
            score += 25
            reasons.append("High-Value Budget (> ₹1 Cr)")
        elif "Lakh" in budget:
            try:
                # Extract number
                import re
                val = float(re.search(r'(\d+[\d\.]*)', budget).group(1))
                if val >= 20:
                    score += 25
                    reasons.append(f"Strong Budget Tier (₹{val} L)")
                elif val >= 10:
                    score += 15
                    reasons.append(f"Moderate Budget Tier (₹{val} L)")
                else:
                    score += 10
            except Exception:
                score += 10
        elif budget != "Unspecified":
            score += 10

        # 2. Area Specified (Up to +20)
        area = spec.get("carpet_area", "")
        if area != "Unspecified":
            score += 20
            reasons.append(f"Clear Carpet Area Specified ({area})")

        # 3. Urgency / Timeline (Up to +15)
        timeline = spec.get("timeline", "")
        if "Immediate" in timeline or "1 Month" in timeline:
            score += 15
            reasons.append("High Urgency (Immediate Start)")
        elif timeline != "Flexible":
            score += 10
            reasons.append(f"Defined Timeline ({timeline})")

        # Cap score at 98 max
        final_score = min(score, 98)

        # Qualification Status & Automated Workflow Action
        if final_score >= 75:
            status = "HOT LEAD (Qualified)"
            action = "Dispatch Instant WhatsApp Brief Card to Principal Architect"
            badge_color = "#10b981"  # Emerald
        elif final_score >= 50:
            status = "WARM LEAD (In Progress)"
            action = "Trigger Auto-Drip WhatsApp Questionnaire for Missing Specs"
            badge_color = "#f59e0b"  # Amber
        else:
            status = "COLD / VAGUE"
            action = "Add to Nurture Drip Campaign"
            badge_color = "#ef4444"  # Red

        return {
            "score": final_score,
            "status": status,
            "badge_color": badge_color,
            "automated_action": action,
            "scoring_reasons": reasons
        }
