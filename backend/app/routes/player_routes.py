from fastapi import APIRouter, HTTPException, Depends, Query
from ..models.player import Player
from typing import List, Optional
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
    team_name = team_name.replace("-", " ")

    if not await db['fantasy-data'].find_one({"team": team_name}):
        raise HTTPException(status_code=404, detail="Player not found")
    
    # Get the top 3 players for each position
    ret = {
        "FWD": [],
        "DEF": [],
        "MID": []
    }
    
    ret["FWD"] = await db['fantasy-data'].find({"team": team_name, "position": "FWD"}, {'_id': 0, 'name': 1, 'position': 1, 'total_points': 1}) \
                                          .sort('total_points', DESCENDING) \
                                          .limit(3) \
                                          .to_list(3)
    
    ret["MID"] = await db['fantasy-data'].find({"team": team_name, "position": "MID"}, {'_id': 0, 'name': 1, 'position': 1, 'total_points': 1}) \
                                          .sort('total_points', DESCENDING) \
                                          .limit(3) \
                                          .to_list(3)
    
    ret["DEF"] = await db['fantasy-data'].find({"team": team_name, "position": {"$in": ["DEF", "GKP"]}}, {'_id': 0, 'name': 1, 'position': 1, 'total_points': 1}) \
                                          .sort('total_points', DESCENDING) \
                                          .limit(3) \
                                          .to_list(3)
    
    return ret

@router.get("/players/search/", response_model=List[dict])
async def search_players(
    query: str = Query(..., min_length=1),
    position: Optional[str] = Query(None, regex="^(Forward|Midfielder|Defender|Goalkeeper)$")
):
    filter_query = {"name": {"$regex": query, "$options": "i"}}
    
    if position:
        position_map = {
            "Forward": "FWD",
            "Midfielder": "MID",
            "Defender": "DEF",
            "Goalkeeper": "GKP"
        }
        filter_query["position"] = position_map[position]

    players = await db['fantasy-data'].find(
        filter_query,
        {'_id': 0, 'name': 1, 'position': 1, 'team': 1, 'total_points': 1}
    ).sort('total_points', DESCENDING).limit(10).to_list(10)

    return players

@router.get("/top-performers/", response_model=dict)
async def get_top_performers():
    positions = ["FWD", "MID", "DEF", "GKP"]
    top_performers = {}

    for position in positions:
        top_performers[position] = await db['fantasy-data'].find(
            {"position": position},
            {'_id': 0, 'name': 1, 'team': 1, 'position': 1, 'points_per_game': 1, 'total_points': 1, 'selected_by_percent': 1}
        ).sort('points_per_game', DESCENDING).limit(5).to_list(5)

    return top_performers

@router.get("/transfer-market/", response_model=dict)
async def get_transfer_market():
    highest_owned = await db['fantasy-data'].find(
        {},
        {'_id': 0, 'name': 1, 'team': 1, 'position': 1, 'selected_by_percent': 1}
    ).sort('selected_by_percent', DESCENDING).limit(10).to_list(10)

    most_transferred_in = await db['fantasy-data'].find(
        {},
        {'_id': 0, 'name': 1, 'team': 1, 'position': 1, 'transfers_in_event': 1}
    ).sort('transfers_in_event', DESCENDING).limit(5).to_list(5)

    most_transferred_out = await db['fantasy-data'].find(
        {},
        {'_id': 0, 'name': 1, 'team': 1, 'position': 1, 'transfers_out_event': 1}
    ).sort('transfers_out_event', DESCENDING).limit(5).to_list(5)

    return {
        "highest_owned": highest_owned,
        "most_transferred_in": most_transferred_in,
        "most_transferred_out": most_transferred_out
    }

