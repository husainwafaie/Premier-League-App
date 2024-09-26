from fastapi import APIRouter, HTTPException, Depends
from ..models.player import Player
from typing import List
from ..db import db
from sqlalchemy import desc
from pymongo import DESCENDING

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

@router.get("/dashboard/", response_model=List[dict])
async def get_dashboard():
    top_players = await db['fantasy-data'].find({}, {'_id': 0, 'name': 1, 'total_points': 1}) \
                                          .sort('total_points', DESCENDING) \
                                          .limit(3) \
                                          .to_list(3)
    
    return top_players