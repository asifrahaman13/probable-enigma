from .ai import OCR
from dotenv import load_dotenv
import os
from .database import MongoDB
from .connection import ConnectionManager

load_dotenv()

mongodb_uri = os.getenv("MONGODB_URI")
assert mongodb_uri, "MONGODB_URI is not set in .env file"

anthropic_model = os.getenv("ANTHROPIC_MODEL")
assert anthropic_model, "ANTHROPIC_MODEL is not set in .env file"

REDIS_PORT = "6379"
assert REDIS_PORT, "Redis port is not set."

REDIS_HOST = "localhost"
assert REDIS_HOST, "Redis host is not set."

ocr = OCR(model=anthropic_model, max_tokens=1000)

database = MongoDB(uri=mongodb_uri)

websocket_manager = ConnectionManager(REDIS_HOST, REDIS_PORT)
