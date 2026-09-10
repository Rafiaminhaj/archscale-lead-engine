from typing import Dict, Any

class LeadScorer:
    """
    3-Tier Automated Triage Lead Intent Scoring Engine.
    Scoring Rubric: Budget (25) > Area (20) > Scope (15) > Timeline (10-15) > Base (20).
    - Hot (>=80): Instant Architect Dispatch
    - Warm (40-79): Studio Human Review Queue
    - Cold (<40): Nurture Drip Campaign
    """
    
    @staticmethod
    def calculate_score(spec: Dict[str, Any]) -> Dict[str, Any]:
        score = 20  # Base Score (+20 pts)
        reasons = ["+20 pts: Inbound Channel Touchpoint (Base)"]

        # 1. Budget Score (Up to +25 pts)
        budget = spec.get("budget", "")
        if "Crore" in budget:
            score += 25
            reasons.append("+25 pts: Premium Budget (> ₹1 Cr)")
        elif "Lakh" in budget:
            score += 25
            reasons.append(f"+25 pts: Budget Tier Specified ({budget})")
        elif budget != "Unspecified":
            score += 15
            reasons.append(f"+15 pts: Budget Specified ({budget})")

        # 2. Carpet Area Score (Up to +20 pts)
        area = spec.get("carpet_area", "")
        if area != "Unspecified":
            score += 20
            reasons.append(f"+20 pts: Carpet Area Defined ({area})")

        # 3. Property Scope (Up to +15 pts)
        scope = spec.get("property_type", "")
        if scope != "Residential":
            score += 15
            reasons.append(f"+15 pts: Clear Property Scope ({scope})")
        else:
            score += 10
            reasons.append("+10 pts: Residential Scope")

        # 4. Timeline / Urgency (Up to +15 pts)
        timeline = spec.get("timeline", "")
        if "Immediate" in timeline or "1 Month" in timeline:
            score += 15
            reasons.append("+15 pts: Immediate Start (< 1 Month)")
        elif timeline != "Flexible":
            score += 10
            reasons.append(f"+10 pts: Defined Timeline ({timeline})")

        final_score = min(score, 98)

        # 3-Tier Automated Triage Routing
        if final_score >= 80:
            status = "HOT LEAD (Qualified)"
            action = "Dispatch Instant WhatsApp Brief Card to Principal Architect"
            badge_color = "#10b981"
        elif final_score >= 40:
            status = "WARM LEAD (Human Review)"
            action = "Route to Studio Human Review Queue & Send Spec Questionnaire"
            badge_color = "#f59e0b"
        else:
            status = "COLD / VAGUE"
            action = "Add to Automated Nurture Drip Campaign"
            badge_color = "#ef4444"

        rubric_str = "Scoring Rubric: Budget (25) > Area (20) > Scope (15) > Timeline (10-15) > Base (20). Hot ≥ 80 auto-dispatches to architect."

        return {
            "score": final_score,
            "status": status,
            "badge_color": badge_color,
            "automated_action": action,
            "scoring_reasons": reasons,
            "rubric": rubric_str
        }
