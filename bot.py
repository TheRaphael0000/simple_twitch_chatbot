import twitch
import json

config = json.load(open("config.json", "r"))

chat = twitch.Chat(channel=f"#{config['channel']}", nickname=config['channel'], oauth=f"oauth:{config['access_token']}")

def get_message(message):
    if len(message.text) < 2 or message.text[0] != "!":
        return

    commands = json.load(open("commands.json", "r"))
    command = message.text[1:]

    if command not in commands:
        message.chat.send(f"Commandes disponible: {', '.join([f'!{c}' for c in commands])}")
        return
        
    message.chat.send(commands[command])


try:
    chat.subscribe(get_message)
except:
    pass