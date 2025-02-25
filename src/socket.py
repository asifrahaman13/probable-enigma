import asyncio
import logging
from fastapi import WebSocket, WebSocketDisconnect
from fastapi import APIRouter
from .ai import AI
from .instances import database

socket_router = APIRouter()

rooms: dict[str, list[WebSocket]] = {}


@socket_router.websocket("/ws/{room_name}")
async def websocket_endpoint(websocket: WebSocket, room_name: str):
    await websocket.accept()
    if room_name not in rooms:
        rooms[room_name] = []

    rooms[room_name].append(websocket)
    logging.info(f"Client connected to room {room_name}")

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
            await websocket.send_json({"message": message, "finished": finished})

    except WebSocketDisconnect:
        logging.info(f"Client disconnected from room {room_name}")
        rooms[room_name].remove(websocket)
        if not rooms[room_name]:
            del rooms[room_name]
    except Exception as e:
        logging.info(f"WebSocket error: {e}")
        await websocket.close()
