import twitch
import json
import os
from columnar import columnar
import datetime
import threading
import time

config = json.load(open("config.json", "r"))

chat = twitch.Chat(channel=f"#{config['channel']}",
                   nickname=config['channel'], oauth=f"oauth:{config['access_token']}")

messages = []
max_messages = config['max_messages']
max_time = datetime.timedelta(seconds=config['max_time'])
previous_table = ""

def commands_handler(message):
    commands = json.load(open("commands.json", "r"))
    command = message.text[1:]

    if command not in commands:
        message.chat.send(
            f"Commandes disponible: {', '.join([f'!{c}' for c in commands])}")
        return

    message.chat.send(commands[command])


def show_messages():
    global previous_table

    if len(messages) > 0:
        data = [[m.sender, m.text] for m, date in messages]
        table = columnar(data, headers=None, justify=["r", "l"], no_borders=True)
    else:
        table = ""

    if previous_table != table:
        os.system('cls')
        print(table)
    previous_table = table


def messages_handler(message):
    print(message)
    now = datetime.datetime.now()
    messages.append((message, now))
    update_messages()
    show_messages()


def get_message(message):
    if len(message.text) > 2 and message.text[0] == "!":
        return commands_handler(message)
    else:
        return messages_handler(message)


def update_messages():
    kept_messages = []
    now = datetime.datetime.now()
    global messages

    for m, date in messages[::-1]:
        if now - date <= max_time:
            kept_messages.append((m, date))

        if len(kept_messages) >= max_messages:
            break

    messages = kept_messages[::-1]
    show_messages()


def messages_watchdog():
    update_messages()
    while True:
        time.sleep(1)
        update_messages()


t = threading.Thread(target=messages_watchdog)
t.start()

try:
    chat.subscribe(get_message)
except:
    pass

