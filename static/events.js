const websocket = new WebSocket("wss://eventsub-beta.wss.twitch.tv/ws")

function message(e) {
    let data = JSON.parse(e.data)
    console.log(data)
}

function open(e) {
    console.log(e)
    let connection = e.currentTarget
}

websocket.addEventListener("message", message)
websocket.addEventListener("open", open)
websocket.addEventListener("error", (e) => console.error(e))
websocket.addEventListener("close", (e) => console.log(e))