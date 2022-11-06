const chat = document.querySelector("#chat")
const websocket = new WebSocket("wss://irc-ws.chat.twitch.tv:443")

let max_messages = 10
let max_time = 15 * 1000
let id = 0

function add_message(infos, text) {
    let date = Date.now()

    let tr = document.createElement("tr")
    tr.classList.add("message", "show")
    tr.dataset.date = date

    let user_td = document.createElement("td")
    user_td.classList.add("user")
    user_td.innerHTML = infos["display-name"]

    let text_td = document.createElement("td")
    text_td.id = "text_" + id
    text_td.classList.add("text")

    tr.appendChild(user_td)
    tr.appendChild(text_td)
    chat.appendChild(tr)

    new Typed('#text_'+id, {strings: [text], typeSpeed: 10})
    id++

    remove_message()
}

function remove_message() {
    let count = 0

    let messages = chat.children
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i]

        if (count >= max_messages || new Date(parseInt(message.dataset.date)).getTime() + max_time < Date.now()) {
            message.classList.remove("show")
            message.remove()
        }
        count += 1
    }
}

function parse_at(at_msg) {
    at_msg = at_msg.substring(1)
    let kv = at_msg.split(";")
    let infos = {}
    for (let l of kv) {
        let ls = l.split("=")
        infos[ls[0]] = ls[1]
    }
    return infos
}

function parse_message(e, message) {
    console.log(message)
    let commands = message.split(" ")

    let infos = {}
    for (let c of commands) {
        if (c[0] == "@")
            infos = parse_at(c)
    }

    if (commands[2] == "PRIVMSG") {
        let text = commands.slice(4, commands.length).join(" ").substring(1)
        add_message(infos, text)
    }

    if (commands[0] == "PING") {
        e.currentTarget.send(message.replace("PING", "PONG"))
    }
}


function message(e) {
    let messages = e.data.split("\r\n")
    for (let message of messages) {
        if (message.length > 0)
            parse_message(e, message)
    }

}

function open(e) {
    let connection = e.currentTarget
    connection.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands')
    connection.send('PASS oauth:' + oauth)
    connection.send('NICK theraphael0000')
    connection.send('JOIN #' + channel)
}

let watcher = setInterval(remove_message, 500)

websocket.addEventListener("message", message)
websocket.addEventListener("open", open)
websocket.addEventListener("error", (e) => console.error(e))
websocket.addEventListener("close", (e) => console.log(e))