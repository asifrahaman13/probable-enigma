from typing import Optional
from pydantic import BaseModel, Field


class PersonalInfo(BaseModel):
    pan: str = Field(
        ...,
        min_length=10,
        max_length=25,
        examples="ABCDE1234F",
        description="Permanent Account Number",
    )
    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        examples="John Doe",
        description="Name of the person",
    )
    date_of_birth: str = Field(
        ...,
        min_length=10,
        max_length=10,
        examples="01/01/2000",
        description="Date of Birth",
    )
    gender: str = Field(
        ...,
        min_length=4,
        max_length=25,
        examples="male",
        description="Gender of the person",
    )
    email_id: str = Field(
        ...,
        min_length=4,
        max_length=25,
        examples="example@gmail.com",
        description="Email ID of the person",
    )
    reference_contact: str = Field(
        ...,
        min_length=10,
        max_length=14,
        examples="9876543210",
        description="Reference Contact Number",
    )


class AIResponse(BaseModel):
    message: str = Field(..., description="Response from the AI model")
    finished: Optional[bool] = Field(..., description="Is the conversation finished?")
