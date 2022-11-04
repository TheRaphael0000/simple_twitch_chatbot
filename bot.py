import json

from flask import Flask
from flask import render_template

config = json.load(open("config.json", "r"))

app = Flask(__name__)

@app.route("/chat")
def chat():
    return render_template('chat.html', oauth=config["oauth"], channel=config["channel"])
