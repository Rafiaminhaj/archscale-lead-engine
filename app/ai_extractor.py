import re
from typing import Dict, Any, List

class ArchSpecExtractor:
    """
    Intelligent Architectural Specification & Intent Extractor.
    Handles edge cases: typos (e.g., '2200sqft'), budget ranges ('30-35L'), mixed casing.
    """
    
    @staticmethod
    def extract_spec(text: str) -> Dict[str, Any]:
        clean_text = text.strip()
        lower_text = clean_text.lower()
        
        # 1. Carpet Area Extraction (handles '2200sqft', '1800 sq ft', '4500sq.ft', '2500sqm')
        area_match = re.search(r'(\d+[\d,]*)\s*(sqft|sq\.?\s*ft|square\s*feet|sqm|sq\.?\s*m)', lower_text)
        if area_match:
            carpet_area = f"{area_match.group(1)} sq ft"
        else:
            # Fallback for attached typos like 2200sqft or 1800sq
            alt_area = re.search(r'(\d+[\d,]*)\s*(sqft|sq)', lower_text)
            carpet_area = f"{alt_area.group(1)} sq ft" if alt_area else "Unspecified"
        
        # 2. Budget Extraction (handles ranges like '30-35 lakhs', '30 to 35L', '80L', '1.5 Cr')
        range_match = re.search(r'(\d+[\d\.]*)\s*(?:-|to)\s*(\d+[\d\.]*)\s*(lakhs?|lacs?|l|cr|crores?|k)', lower_text)
        if range_match:
            v1, v2, unit = range_match.group(1), range_match.group(2), range_match.group(3)
            if unit in ['l', 'lakh', 'lakhs', 'lac', 'lacs']:
                budget = f"₹{v1} - ₹{v2} Lakhs"
            elif unit in ['cr', 'crore', 'crores']:
                budget = f"₹{v1} - ₹{v2} Crores"
            else:
                budget = f"₹{v1} - ₹{v2}"
        else:
            budget_match = re.search(r'(\d+[\d\.]*)\s*(lakhs?|lacs?|l|cr|crores?|k)', lower_text)
            if budget_match:
                val, unit = budget_match.group(1), budget_match.group(2)
                if unit in ['l', 'lakh', 'lakhs', 'lac', 'lacs']:
                    budget = f"₹{val} Lakhs"
                elif unit in ['cr', 'crore', 'crores']:
                    budget = f"₹{val} Crores"
                elif unit == 'k':
                    budget = f"₹{val}K"
                else:
                    budget = f"₹{val}"
            else:
                alt_budget = re.search(r'₹?\s*(\d+[\d\.]*)\s*(lakh|cr)?', lower_text)
                budget = f"₹{alt_budget.group(1)} Lakhs" if alt_budget and alt_budget.group(2) else "Unspecified"

        # 3. Property / Scope Type
        prop_type = "Residential"
        flat_match = re.search(r'([1-5]\s*bhk)', lower_text)
        bhk_prefix = f"{flat_match.group(1).upper()} " if flat_match else ""
        
        if "penthouse" in lower_text:
            prop_type = f"{bhk_prefix}Penthouse" if bhk_prefix else "Penthouse"
        elif any(w in lower_text for w in ["office", "shop", "commercial", "cafe", "restaurant", "store", "studio"]):
            prop_type = "Commercial"
        elif any(w in lower_text for w in ["villa", "bungalow", "duplex"]):
            prop_type = f"{bhk_prefix}Luxury Villa" if bhk_prefix else "Luxury Villa"
        elif flat_match or "flat" in lower_text or "apartment" in lower_text:
            prop_type = f"Apartment ({bhk_prefix.strip()})" if bhk_prefix else "Apartment"

        # 4. Design Style Preference
        styles = []
        style_keywords = {
            "Modern": ["modern", "contemporary"],
            "Minimalist": ["minimalist", "clean", "simple"],
            "Luxury / Premium": ["luxury", "premium", "high-end", "grand", "italian marble"],
            "Traditional / Heritage": ["traditional", "heritage", "ethnic", "wooden"],
            "Industrial": ["industrial", "raw", "exposed"]
        }
        for style, keywords in style_keywords.items():
            if any(kw in lower_text for kw in keywords):
                styles.append(style)
        design_style = ", ".join(styles) if styles else "Standard Modern"

        # 5. Timeline / Urgency
        timeline = "Flexible"
        if any(w in lower_text for w in ["urgent", "asap", "immediately", "this month"]):
            timeline = "Immediate (< 1 Month)"
        elif "month" in lower_text:
            m_match = re.search(r'(\d+)\s*months?', lower_text)
            timeline = f"{m_match.group(1)} Months" if m_match else "3 Months"

        # Missing fields
        missing = []
        if carpet_area == "Unspecified":
            missing.append("Carpet Area (sq ft)")
        if budget == "Unspecified":
            missing.append("Target Budget")

        return {
            "property_type": prop_type,
            "carpet_area": carpet_area,
            "budget": budget,
            "design_style": design_style,
            "timeline": timeline,
            "missing_fields": missing,
            "raw_message": clean_text
        }
