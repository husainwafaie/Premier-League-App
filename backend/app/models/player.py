from pydantic import BaseModel, Field
from typing import Optional, List
import datetime

class Player(BaseModel):
    id:int
    name:str
    now_cost:int
    position:str
    team:str
    influence_rank_type:int
    saves:int
    region: Optional[int] = None
    selected_rank:int
    event_points:int
    points_per_game:float
    cost_change_start:int
    now_cost_rank:int
    points_per_game_rank:int
    value_form:float
    clean_sheets:int
    expected_goal_involvements:float
    creativity_rank_type:int
    transfers_in_event:int
    form:float
    creativity:float
    now_cost_rank_type:int
    influence:float
    threat_rank_type:int
    ict_index_rank:int
    assists:int
    penalties_order:Optional[int] = None
    starts:int
    expected_goals_conceded:float
    cost_change_event_fall:int
    bonus:int
    influence_rank:int
    selected_by_percent:float
    news:Optional[str] = None
    transfers_out:int
    bps:int
    form_rank_type:int
    chance_of_playing_next_round:Optional[int]
    form_rank:int
    yellow_cards:int
    goals_conceded_per_90:float
    expected_assists_per_90:float
    in_dreamteam:bool
    web_name:str
    selected_rank_type:int
    expected_assists:float
    ep_next:float
    total_points:int
    ep_this:float
    cost_change_event:int
    threat_rank:int
    chance_of_playing_this_round:Optional[int] = None
    creativity_rank:int
    clean_sheets_per_90:float
    expected_goals_conceded_per_90:float
    goals_conceded:int
    value_season:float
    ict_index:float
    own_goals:int
    minutes:int
    transfers_in:int
    status:str
    ict_index_rank_type:int
    threat:int
    points_per_game_rank_type:int
    direct_freekicks_order:Optional[int] = None
    goals_scored:int
    dreamteam_count:int
    corners_and_indirect_freekicks_order:Optional[int] = None
    saves_per_90:float
    transfers_out_event:int
    expected_goals_per_90:float
    red_cards:int
    starts_per_90:float
    penalties_saved:int
    news_added:Optional[datetime.datetime] = None
    expected_goal_involvements_per_90:float
    cost_change_start_fall:int
    expected_goals:float
    penalties_missed:int

#     name: str
#     now_cost: float
#     position: str
#     team: str
#     event_points: int
#     total_points: int
#     goals_scored: int
#     assists: int
#     clean_sheets: int
#     selected_by_percent: float
#     form: float
#     status: str
#     news: Optional[str]

# class CreatePlayerModel(Player):
#     pass

# class UpdatePlayerModel(BaseModel):
#     now_cost: Optional[float]
#     event_points: Optional[int]
#     total_points: Optional[int]
#     goals_scored: Optional[int]
#     assists: Optional[int]
#     clean_sheets: Optional[int]
#     selected_by_percent: Optional[float]
#     form: Optional[float]
#     status: Optional[str]
#     news: Optional[str]
