let players = []
let lock = false

let join_lock = document.getElementById("join_lock")
let join_message = document.getElementById("join_message")


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

    if (lock)
        return

    let p = tags["display-name"]
    if (players.includes(p))
        return

    players.push(p)
    render()
}

function toggle_lock() {
    join_lock.classList.toggle("fa-lock-open")
    join_lock.classList.toggle("fa-lock")
    lock ^= true
    join_message.style.display = lock ? "none" : "inline-block"
}

join_lock.addEventListener("click", toggle_lock)


const client = new tmi.Client({
    channels: [config['channel']]
});

client.connect();

client.on('message', message);