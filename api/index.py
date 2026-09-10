import os
import sys

# Add project root directory to python path for Vercel Serverless Function
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.main import app
