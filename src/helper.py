import base64
import random
from io import BytesIO
from PIL import Image
import pytesseract


def generate_6_digit_code() -> str:
    return str(random.randint(100000, 999999))


def dict_to_text(data: dict) -> str:
    text = ""
    for key, value in data.items():
        text += f"{key}: {value}\n"
    return text


def ocr_image(base64_string: str) -> dict:
    image_bytes = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_bytes))
    extracted_text = pytesseract.image_to_string(image)
    return extracted_text.strip()
