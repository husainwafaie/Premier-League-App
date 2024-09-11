import requests
from bs4 import BeautifulSoup

def scrape_player_data():
    url = 'need to insert'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    players = []
    for player in soup.select('div.player'):
        name = player.select_one('h2.name').text
        goals = player.select_one('span.goals').text
        assists = player.select_one('span.assists').text
        players.append({'name': name, 'goals': goals, 'assists': assists})
    return players
