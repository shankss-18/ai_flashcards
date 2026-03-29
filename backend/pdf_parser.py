import fitz
import os
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text_from_pdf(file):
    text = ""
    pdf = fitz.open(stream=file.read(), filetype="pdf")
    
    for page in pdf:
        page_text = page.get_text().strip()
        
        # If text is found natively, use it
        if page_text:
            text += page_text + "\n"
        else:
            # Fallback to OCR using Groq Vision API
            try:
                # Get the page as an image (pixmap)
                pix = page.get_pixmap(dpi=150)
                img_data = pix.tobytes("jpeg")
                base64_img = base64.b64encode(img_data).decode("utf-8")
                
                # Send to Groq for OCR
                response = client.chat.completions.create(
                    model="meta-llama/llama-4-scout-17b-16e-instruct",
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text", 
                                    "text": "Extract all the text from this image exactly as written. If there is no text or it's a blank page, reply ONLY with [NO TEXT]."
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        # Use standard data URL format for base64 image
                                        "url": f"data:image/jpeg;base64,{base64_img}"
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens=1024,
                    temperature=0.1
                )
                
                ocr_text = response.choices[0].message.content.strip()
                if "[NO TEXT]" not in ocr_text and ocr_text:
                    text += ocr_text + "\n"
                    
            except Exception as e:
                print(f"OCR failed for a page: {e}")
                
    pdf.close()
    return text.strip()