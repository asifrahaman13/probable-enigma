from .ai import OCR
from .database import MongoDB
from .connection import ConnectionManager
from .twilio_message import Twilio
from .config import Config


config = Config.load_config()

ocr = OCR(model=config.anthropic_model, max_tokens=3500)

database = MongoDB(uri=config.mongodb_uri)

websocket_manager = ConnectionManager(
    redis_host=config.redis_host, redis_port=config.redis_port
)

twilio = Twilio(config.account_sid, config.auth_token, config.from_number)
