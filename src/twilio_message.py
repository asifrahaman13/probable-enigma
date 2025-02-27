from twilio.rest import Client
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

load_dotenv()


class Twilio:
    def __init__(self, account_sid: str, auth_token: str, from_number: str) -> None:
        self.client = Client(account_sid, auth_token)
        self.from_number = from_number

    def send_message(self, to: str, verification_code: str) -> bool:
        try:
            _ = self.client.messages.create(
                body=f"Your OTP is {verification_code}", to=to, from_=self.from_number
            )
            return True
        except Exception as e:
            logging.error(f"Failed to send message: {e}")
            return False
