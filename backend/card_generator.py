import os 
import json 
import re
import groq 
from dotenv import load_dotenv

load_dotenv()  

client = groq.Groq(api_key = os.getenv("GROQ_API_KEY"))

def generate_cards(text, count, language):
    # Smart Representation Sampling for Large Documents
    max_chars = 15000
    if len(text) > max_chars:
        chunk_size = max_chars // 3
        
        part1 = text[:chunk_size]
        
        mid_start = (len(text) // 2) - (chunk_size // 2)
        part2 = text[mid_start:mid_start + chunk_size]
        
        part3 = text[-chunk_size:]
        
        text = f"{part1}\n\n...[content skipped for brevity]...\n\n{part2}\n\n...[content skipped for brevity]...\n\n{part3}"
        
    prompt = f"""You are a flashcard generator.
                Your job is to create {count} flashcards from the text below.
                Output language: {language}


                STRICT RULES:
                - Respond ONLY with a valid JSON array
                - No explanation, no preamble, no markdown, no code fences
                - Each item must have exactly four keys: "question", "answer", "id", and "title"
                - Questions should test understanding, not just memory
                -Title is the title of the flashcard
                - Answers should be concise — 1 to 3 sentences max


                Format:
                [
                {{"question": "...", "answer": "...", "id": 0, "title": "..."}},
                {{"question": "...", "answer": "...", "id": 1, "title": "..."}},
                {{"question": "...", "answer": "...", "id": 2, "title": "..."}}
                ]


                Text to generate flashcards from:
                {text}"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a JSON-only flashcard generator. Always respond with a valid JSON array and nothing else."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )

    output = response.choices[0].message.content.strip()

    # Remove markdown code fences if the model wraps the response
    output = re.sub(r"^```(?:json)?\s*", "", output)
    output = re.sub(r"\s*```$", "", output)

    parsed = json.loads(output)

    # Handle if the model returns { "cards": [...] } or { "flashcards": [...] } instead of a plain array
    if isinstance(parsed, dict):
        for key in parsed:
            if isinstance(parsed[key], list):
                return parsed[key]
        raise ValueError("Could not find a flashcard array in the response")

    return parsed