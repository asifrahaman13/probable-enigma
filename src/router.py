from fastapi import APIRouter, File, Form, UploadFile
import base64
from .instances import ocr, database
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

router = APIRouter()


@router.post("/upload")
async def upload(documentName: str = Form(...), file: UploadFile = File(...)):
    file_content = await file.read()
    encoded_file = base64.b64encode(file_content).decode("utf-8")

    extracted_information = await ocr.ocr_image(encoded_file)

    logging.info(extracted_information)
    await database.insert(
        "documents", {"documentName": documentName, **extracted_information}
    )

    return {"documentName": documentName, **extracted_information}
