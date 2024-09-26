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

@router.get("/teams/{team_name}", response_model=dict)
async def get_player(team_name: str):
    ret = {
        "FWD": [],
        "DEF": [],
        "MID": []
    }
    #Modify the query to get only
    players = await db['fantasy-data'].find({"team": team_name}, {'_id': 0, 'name': 1, 'position': 1, 'total_points': 1})
    for player in players:
        if player['position'] == 'FWD':
            ret['FWD'].append(player)
        elif player['position'] == 'DEF' or player['position'] == 'GKP':
            ret['DEF'].append(player)
        elif player['position'] == 'MID':
            ret['MID'].append(player)
    return ret
    raise HTTPException(status_code=404, detail="Player not found")