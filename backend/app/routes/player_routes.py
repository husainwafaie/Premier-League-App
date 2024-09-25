from fastapi import APIRouter, HTTPException
from ..models.player import Player
from typing import List
from ..db import db

router = APIRouter()

@router.get("/players/{player_id}", response_model=Player)
async def get_player(player_id: int):
    player = await db['players'].find_one({"id": player_id})
    if player:
        return player
    raise HTTPException(status_code=404, detail="Player not found")

@router.get("/players/", response_model=List[Player])
async def get_players():
    players = await db['fantasy-data'].find({}, {'_id': 0}).to_list(1)
    return players