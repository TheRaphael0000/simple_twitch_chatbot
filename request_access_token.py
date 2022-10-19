import webbrowser
import json

config = json.load(open("config.json", "r"))

url = f"https://id.twitch.tv/oauth2/authorize?response_type=token&client_id={config['client_id']}&redirect_uri={config['redirect_uri']}&scope={config['scope']}"

webbrowser.open_new_tab(url)
