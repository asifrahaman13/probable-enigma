from .ai import OCR
from dotenv import load_dotenv
from .database import MongoDB
from .connection import ConnectionManager
from .twilio_message import Twilio
from .config import (
    anthropic_model,
    mongodb_uri,
    account_sid,
    auth_token,
    from_number,
    redis_host,
    redis_port,
)

load_dotenv()


ocr = OCR(model=anthropic_model, max_tokens=1000)

database = MongoDB(uri=mongodb_uri)

websocket_manager = ConnectionManager(redis_host=redis_host, redis_port=redis_port)

twilio = Twilio(account_sid, auth_token, from_number)
