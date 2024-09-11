from fastapi import FastAPI
from app.routes.player_routes import router as player_router

app = FastAPI()

app.include_router(player_router, prefix="/players")
