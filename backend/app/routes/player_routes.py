from fastapi import APIRouter
from app.services.scraping import scrape_player_data
from app.db import db

router = APIRouter()

@router.get("/")
async def get_players():
    players = await db['players'].find().to_list(100)
    return players

@router.post("/scrape")
async def scrape_and_save_players():
    players = scrape_player_data()
    await db['players'].insert_many(players)
    return {"message": "Players scraped and saved!"}
