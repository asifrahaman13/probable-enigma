import asyncio
import logging
from fastapi import WebSocket, WebSocketDisconnect
from fastapi import APIRouter
from .ai import AI
from .instances import database, websocket_manager

socket_router = APIRouter()


@socket_router.websocket("/ws/{room_name}")
async def websocket_endpoint(websocket: WebSocket, room_name: str):
    await websocket_manager.connect(websocket, room_name)
    logging.info("Client connected")
    data_present = await database.find("doucments", {"pan": room_name})
    ai_instance = AI(
        model="anthropic.claude-3-5-sonnet-20240620-v1:0",
        max_tokens=1000,
        already_present=data_present,
    )
    try:
        while True:
            data = await websocket.receive_json()
            ai_instance.messages.append({"role": "user", "content": data["message"]})
            message, finished = await ai_instance.get_response()
            ai_instance.messages.append({"role": "assistant", "content": message})
            await asyncio.sleep(0)
            await websocket_manager.send_personal_message(
                {"message": message, "finished": finished}, websocket
            )
    except WebSocketDisconnect:
        logging.info(f"Client disconnected from room {room_name}")
        await websocket_manager.disconnect(websocket)
