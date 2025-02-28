import os
from dotenv import load_dotenv
from dataclasses import dataclass

load_dotenv()


@dataclass
class Config:
    mongodb_uri: str
    anthropic_model: str
    account_sid: str
    auth_token: str
    from_number: str
    redis_host: str
    redis_port: str

    @classmethod
    def load_config(cls):
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

        redis_host = os.getenv("REDIS_HOST")
        assert redis_host, "REDIS_HOST is not set in .env file"

        redis_port = os.getenv("REDIS_PORT")
        assert redis_port, "REDIS_PORT is not set in .env file"

        return cls(
            mongodb_uri=mongodb_uri,
            anthropic_model=anthropic_model,
            account_sid=account_sid,
            auth_token=auth_token,
            from_number=from_number,
            redis_host=redis_host,
            redis_port=redis_port,
        )
