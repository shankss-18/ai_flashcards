from flask import Flask , request , jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pdf_parser import extract_text_from_pdf
from card_generator import generate_cards
import os 

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/extract-text", methods=['POST'])
def extract_text():

    if "file" not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400 

    file = request.files['file']

    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400

    file.seek(0, 2)
    size = file.tell()
    file.seek(0)

    if size > 10 * 1024 * 1024:
        return jsonify({'error': 'File size exceeds 10MB limit.'}), 400
    
    text = extract_text_from_pdf(file)
    if not text.strip():
        return jsonify({'error': 'No text found in the PDF.'}), 400
    
    return jsonify({'text': text})

@app.route("/generate-cards", methods=["POST"])
def generate_cards_route():
    try:
        data = request.json

        if not data:
            return jsonify({ "error": "No data sent" }), 400
        
        if "text" not in data:
            return jsonify({ "error": "No text provided" }), 400
        
        if "count" not in data:
            return jsonify({ "error": "No card count provided" }), 400
        
        if "language" not in data:
            return jsonify({ "error": "No language provided" }), 400

        text = data["text"]
        count = int(data["count"])
        language = data["language"]

        if len(text.split()) < 30:
            return jsonify({ "error": "Text too short. Please provide at least 30 words." }), 400

        cards = generate_cards(text, count, language)

        return jsonify({ "cards": cards })

    except Exception as e:
        print("ERROR:", str(e))  
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
