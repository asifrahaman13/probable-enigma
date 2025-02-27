import os
from dotenv import load_dotenv

load_dotenv()


mongodb_uri = os.getenv("MONGODB_URI")
assert mongodb_uri, "MONGODB_URI is not set in .env file"

anthropic_model = os.getenv("ANTHROPIC_MODEL")
assert anthropic_model, "ANTHROPIC_MODEL is not set in .env file"

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
assert account_sid, "TWILIO_ACCOUNT_SID is not set in .env file"

auth_token = os.getenv("TWILIO_AUTH_TOKEN")
assert auth_token, "TWILIO_AUTH_TOKEN is not set in .env file"

from_number = os.getenv("TWILIO_PHONE_NUMBER")
assert from_number, "TWILIO_PHONE_NUMBER is not set in .env file"

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
assert account_sid, "TWILIO_ACCOUNT_SID is not set in .env file"

auth_token = os.getenv("TWILIO_AUTH_TOKEN")
assert auth_token, "TWILIO_AUTH_TOKEN is not set in .env file"

from_number = os.getenv("TWILIO_PHONE_NUMBER")
assert from_number, "TWILIO_PHONE_NUMBER is not set in .env file"

redis_host = os.getenv("REDIS_HOST")
assert redis_host, "REDIS_HOST is not set in .env file"

redis_port = os.getenv("REDIS_PORT")
assert redis_port, "REDIS_PORT is not set in .env file"
