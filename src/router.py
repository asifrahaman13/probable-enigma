import base64
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from .instances import ocr, database, twilio
from .ai import AI
import logging
from .model import UserMessage, PersonalInfo, OTP
from .helper import generate_6_digit_code


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

router = APIRouter()


@router.get("/send-otp/{phone_number}")
async def send_otp(phone_number: str):
    try:
        otp = generate_6_digit_code()

        await database.insert(
            "otp", {"phone_number": phone_number, "otp": otp, "verified": False}
        )
        response = twilio.send_message(phone_number, otp)
        if response is True:
            return JSONResponse(
                {"status": "success", "message": "OTP sent successfully"}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to send OTP")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/verify-otp")
async def verify_otp(otp: OTP):
    try:
        data = await database.find(
            "otp", {"phone_number": otp.phone_number, "otp": otp.otp}
        )
        if len(data) == 0:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        await database.update(
            "otp",
            {"phone_number": otp.phone_number, "otp": otp.otp},
            {"verified": True},
        )
        return JSONResponse(
            {"status": "success", "message": "OTP verified successfully"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload")
async def upload(documentName: str = Form(...), file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        encoded_file = base64.b64encode(file_content).decode("utf-8")
        extracted_information = await ocr.ocr_image(encoded_file)

        logging.info(extracted_information)
        await database.insert(
            "documents", {"documentName": documentName, **extracted_information}
        )
        return JSONResponse({"documentName": documentName, **extracted_information})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/update-details")
async def update_user_details(message: UserMessage):
    try:
        logging.info(message)
        response = await AI.extract_details(message.message)
        logging.info(response)
        await database.update(
            "documents",
            {"pan": response.pan},
            response.dict(exclude_none=True),
        )
        return JSONResponse({"status": "success", "message": response.model_dump()})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get-details/{pan}")
async def get_user_details(pan: str):
    try:
        data = await database.find("documents", {"pan": pan})
        for document in data:
            document["_id"] = str(document["_id"])

        return data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/confirm-details")
async def confirm_user_details(user_details: PersonalInfo):
    print(user_details)
    try:
        await database.update(
            "documents",
            {"pan": user_details.pan},
            user_details.model_dump(),
        )
        return JSONResponse(
            {"status": "success", "message": "Details verified successfully"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
