import asyncio
import logging
import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from src.router import router
from src.websocket import socket_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["api"])
app.include_router(socket_router, tags=["socket"])


@app.get("/health")
async def health():
    return {"status": "ok"}


async def run_server():
    config = uvicorn.Config("src.main:app", host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    logging.info("Application starting....")
    try:
        asyncio.run(run_server())
    except Exception as e:
        logging.error(f"Failed to start server: {e}")
