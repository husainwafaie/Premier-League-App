from motor.motor_asyncio import AsyncIOMotorClient
from os import getenv
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = getenv('MONGO_URI')

client = AsyncIOMotorClient(MONGO_URI)
db = client['premier_league']
