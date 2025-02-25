from motor.motor_asyncio import AsyncIOMotorClient


class MongoDB:
    def __init__(self, uri: str):
        self.client = AsyncIOMotorClient(uri)
        self.db = self.client["Onboard"]

    async def insert(self, collection: str, data: dict):
        return await self.db[collection].insert_one(data)

    async def find(self, collection: str, query: dict):
        return await self.db[collection].find(query).to_list(None)
