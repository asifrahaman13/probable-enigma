from fastapi import APIRouter, File, Form, HTTPException, UploadFile
import base64
from .instances import ocr, database
from .ai import AI
import logging
from .model import UserMessage, PersonalInfo


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

router = APIRouter()


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
        return {"documentName": documentName, **extracted_information}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/update-details")
async def update_user_details(message: UserMessage):
    try:

        logging.info(message)
        response=await AI.extract_details(message.message)
        logging.info(response)
        await database.update(
            "documents",
            { "pan": response.pan },
            response.dict(exclude_none=True),
        )
        return {"status": "success", "message": response.model_dump()}
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
        return {"status": "success", "message": "Details verified successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))