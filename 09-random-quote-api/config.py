import os
from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv("FLASK_DEBUG", "False") == "True"
