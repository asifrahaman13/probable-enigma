from twilio.rest import Client
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")


class Twilio:
    def __init__(self, account_sid: str, auth_token: str, from_number: str) -> None:
        self.client = Client(account_sid, auth_token)
        self.from_number = from_number

    def send_message(self, to: str, verification_code: str) -> bool:
        _ = self.client.messages.create(
            body=f"Your OTP is {verification_code}", to=to, from_=self.from_number
        )
        return True

    def send_whatsapp_message(self, to: str, message: str) -> bool:
        _ = self.client.messages.create(
            body=message,
            to="whatsapp:+918327562300",
            from_="whatsapp:+14155238886",
        )
        return True
