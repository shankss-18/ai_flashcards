import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv("d:/production/deployed_projects/flashcard_ai/backend/.env")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

try:
    models = client.models.list()
    out = [m.id for m in models.data]
    with open("d:/production/deployed_projects/flashcard_ai/backend/groq_models.json", "w") as f:
        json.dump(out, f, indent=2)
except Exception as e:
    with open("d:/production/deployed_projects/flashcard_ai/backend/groq_models.json", "w") as f:
        f.write(str(e))
