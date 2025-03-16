import base64
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from ..instances import ocr, database, twilio
from ..repo.ai import AI
import logging
from ..models.model import UserMessage, PersonalInfo, OTP
from ..helper.helper import generate_6_digit_code, dict_to_text, ocr_image


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
        data = await database.find("otp", {"phone_number": otp.phone_number})
        if len(data) == 0:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        if data[0]["otp"] != otp.otp:
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
async def upload(
    mobile_number: str = Form(...),
    documentName: str = Form(...),
    file: UploadFile = File(...),
):
    try:
        file_content = await file.read()
        encoded_file = base64.b64encode(file_content).decode("utf-8")

        image_content = ocr_image(encoded_file)
        logging.info(f"The content extracted is : {image_content}")
        extracted_information = await ocr.ocr_image(encoded_file, image_content)
        extracted_information["mobile_number"] = mobile_number

        logging.info(extracted_information)
        response = await database.insert(
            "documents", {"documentName": documentName, **extracted_information}
        )

        if response is None:
            raise HTTPException(status_code=500, detail="Failed to save document")

        return JSONResponse({"documentName": documentName, **extracted_information})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/update-details/{mobile_number}")
async def update_user_details(mobile_number: str, message: UserMessage):
    try:
        logging.info(message)
        response = await AI.extract_details(message.message)
        logging.info(response)
        await database.update(
            "documents",
            {"mobile_number": mobile_number},
            response.dict(exclude_none=True),
        )
        text_data = dict_to_text(response.model_dump())
        result = twilio.send_whatsapp_message(
            mobile_number,
            f"Your details are verified successfully:\n {text_data}",
        )
        if result is False:
            raise HTTPException(status_code=500, detail="Failed to send message")
        return JSONResponse({"status": "success", "message": response.model_dump()})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get-details/{mobile_number}")
async def get_user_details(mobile_number: str):
    try:
        data = await database.find("documents", {"mobile_number": mobile_number})

        for document in data:
            document["_id"] = str(document["_id"])

        return data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/confirm-details")
async def confirm_user_details(user_details: PersonalInfo):
    try:
        await database.update(
            "documents",
            {"mobile_number": user_details.mobile_number},
            user_details.model_dump(),
        )
        text_data = dict_to_text(user_details.model_dump())
        response = twilio.send_whatsapp_message(
            user_details.mobile_number,
            f"Your details are verified successfully: \n{text_data}",
        )
        if response is False:
            raise HTTPException(status_code=500, detail="Failed to send message")
        return JSONResponse(
            {"status": "success", "message": "Details verified successfully"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
