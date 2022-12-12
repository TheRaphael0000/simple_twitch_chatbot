let players = []


function removePlayer(p) {
    console.log(p)
    players.splice(p, 1)
    console.log(players)
    render();
}

function PlayerList() {
    return (
        <ol>
            {players.map((p) => <li onClick={() => removePlayer(p)}>{p}</li>)}
        </ol>
    );
}


function render() {
    const root = ReactDOM.createRoot(document.getElementById("playerList"));
    root.render(<PlayerList />);
}

render();

function message(channel, tags, message, self) {
    if (!message.startsWith("!join"))
        return
    let p = tags["display-name"]
    if (players.includes(p))
        return

    players.push(p)
    render()
}


const client = new tmi.Client({
    channels: [config['channel']]
});

client.connect();

client.on('message', message);