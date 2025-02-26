from typing import Optional
from pydantic import BaseModel, Field


class PersonalInfo(BaseModel):
    mobile_number: Optional[str] = Field(
        None,
        min_length=10,
        max_length=14,
        examples="9876543210",
        description="Mobile Number of the person",
    )
    pan: Optional[str] = Field(
        None,
        min_length=10,
        max_length=25,
        examples="ABCDE1234F",
        description="Permanent Account Number",
    )
    name: Optional[str] = Field(
        None,
        min_length=3,
        max_length=100,
        examples="John Doe",
        description="Name of the person",
    )
    date_of_birth: Optional[str] = Field(
        None,
        min_length=10,
        max_length=10,
        examples="01/01/2000",
        description="Date of Birth",
    )
    gender: Optional[str] = Field(
        None,
        min_length=4,
        max_length=25,
        examples="male",
        description="Gender of the person",
    )
    email_id: Optional[str] = Field(
        None,
        min_length=4,
        max_length=25,
        examples="example@gmail.com",
        description="Email ID of the person",
    )
    reference_contact: Optional[str] = Field(
        None,
        min_length=10,
        max_length=14,
        examples="9876543210",
        description="Reference Contact Number",
    )
    education: Optional[str] = Field(
        None,
        min_length=3,
        max_length=100,
        examples="B.Tech",
        description="Education Qualification",
    )
    married: Optional[str] = Field(None, description="Marital Status of the person")


class AIResponse(BaseModel):
    message: str = Field(..., description="Response from the AI model")
    finished: Optional[bool] = Field(
        ..., description="Is the AI has generated the full summary?"
    )


class UserMessage(BaseModel):
    message: str = Field(..., description="Message from the user")
