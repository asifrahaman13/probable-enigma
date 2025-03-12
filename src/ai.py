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

    async def ocr_image(self, base_64_image: str, image_content: str) -> Awaitable[str]:
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
                "text": f"""You are an expert in detecting the information out of the image. \n
                
                Please provide the following details from the vechicle image provided:
                - pan
                - name
                - date_of_birth (yyyy-mm-dd)
                - gender (Male, Female, Other)
                - email_id
                - reference_contact (+cc xxxxxxxxxx)

                If the format given by the user is not correct then ask the user to provide the correct format or correct it yourself if possible.

                If any information is not present mark it ask <UNKNOWN>.

                The text information present for more clarity from the image is:
                {image_content}
                """,
            }
        )
        messages = [{"role": "user", "content": content}]
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
                - date_of_birth (yyyy-mm-dd)
                - gender (Male, Female, Other)
                - email_id
                - reference_contact  (+cc xxxxxxxxxx)\n
                Ask one question at a time and get the information from the user. If user has already answered the question, then skip that question and move on to the next one.
                If the format given by the user is not correct then ask the user to provide the correct format or correct yourself if possible.\n
                The information already present is as follows: {already_present}
                When you have collected all the information then give a summary of the information collected and ask the user to confirm the information.
                """,
            }
        ]

    async def get_response(self) -> Awaitable[str]:
        response = await self.async_client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            messages=self.messages,
            response_model=AIResponse,
        )

        logging.info(f"Response from the bedrock API: {response}")
        return response.message, response.finished

    @staticmethod
    async def extract_details(message: str) -> Awaitable[PersonalInfo]:
        response = await instructor.from_anthropic(
            AsyncAnthropicBedrock()
        ).messages.create(
            model="anthropic.claude-3-5-sonnet-20240620-v1:0",
            max_tokens=3500,
            messages=[
                {
                    "role": "assistant",
                    "content": """Your job is to extract out the deetails from the information provided by the user. Extract the following information and only give the json 
                        response: 
                        - pan
                        - name
                        - date_of_birth (yyyy-mm-dd)
                        - gender (Male, Female, Other)
                        - email_id
                        - reference_contact  (+cc xxxxxxxxxx)\n
                        
                        If the format given by the user is not correct then ask the user to provide the correct format or correct it yourself if possible.
                        """,
                },
                {"role": "user", "content": message},
            ],
            response_model=PersonalInfo,
        )
        logging.info(f"Response from the bedrock API: {response}")
        return response
