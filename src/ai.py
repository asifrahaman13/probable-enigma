import logging
from typing import Awaitable
from .model import PersonalInfo
import instructor
from anthropic import AsyncAnthropicBedrock
from .model import AIResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")


class OCR:
    def __init__(self, model: str, max_tokens: int) -> None:
        self.model = model
        self.max_tokens = max_tokens
        self.async_client_json = instructor.from_anthropic(AsyncAnthropicBedrock())

    async def ocr_image(self, base_64_image: str) -> Awaitable[str]:
        content = [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": base_64_image,
                },
            }
        ]

        content.append(
            {
                "type": "text",
                "text": """You are an expert in detecting the information out of the image. \n
                
                Please provide the following details from the vechicle image provided:
                - pan
                - name
                - date_of_birth
                - gender
                - email_id
                - reference_contact
                """,
            }
        )
        messages = [{"role": "user", "content": content}]
        try:
            (
                _,
                response,
            ) = await self.async_client_json.messages.create_with_completion(
                model=self.model,
                max_tokens=self.max_tokens,
                messages=messages,
                response_model=PersonalInfo,
            )

            logging.info(f"Response from the bedrock API: {response}")
            return response.content[0].input
        except Exception as e:
            raise e


class AI:
    def __init__(self, model: str, max_tokens: int, already_present: str) -> None:
        self.model = model
        self.max_tokens = max_tokens
        self.async_client = instructor.from_anthropic(AsyncAnthropicBedrock())
        self.messages = [
            {
                "role": "assistant",
                "content": f"""You are expert at extracting text. Now your task is to ask question from the user to get the required information:
                - pan
                - name
                - date_of_birth
                - gender
                - email_id
                - reference_contact

                Ask one question at a time and get the information from the user. If user has already answered the question, then skip that question and move on to the next one.

                The information already present is as follows: {already_present}

                When you have collected all the information then give a summary of the information collected and ask the user to confirm the information.
                """,
            }
        ]

    async def get_response(self) -> Awaitable[str]:
        try:
            response = await self.async_client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                messages=self.messages,
                response_model=AIResponse,
            )

            logging.info(f"Response from the bedrock API: {response}")
            return response.message, response.finished
        except Exception as e:
            raise e

    @staticmethod
    async def extract_details(message: str) -> Awaitable[PersonalInfo]:
        try:
            response = await instructor.from_anthropic(
                AsyncAnthropicBedrock()
            ).messages.create(
                model="anthropic.claude-3-5-sonnet-20240620-v1:0",
                max_tokens=1000,
                
                messages=[
                    {
                        "role": "assistant",
                        "content": """Your job is to extract out the deetails fromt the information provided by the user. Extract the following information and only give the json 
                        response: 
                        - pan
                        - name
                        - date_of_birth
                        - gender
                        - email_id
                        - reference_contact
                        
                        """,
                    },
                    {"role": "user", "content": message},
                ],
                response_model=PersonalInfo,
            )
            logging.info(f"Response from the bedrock API: {response}")
            return response
        except Exception as e:
            raise e
