let ws
let ws_endpoint = "wss://eventsub-beta.wss.twitch.tv/ws"
let sfx = document.querySelector("#sfx")
let notification = document.querySelector("#notification")
let follower = document.querySelector("#follower")

function open(event) {
    console.log('INFO: Socket Opened')
}

function error(error) {
    console.log('ERR:  ' + JSON.stringify(error))
}

function subscribe_to_events(message) {
    fetch("https://api.twitch.tv/helix/eventsub/subscriptions",
        {
            method: "POST",
            headers: {
                "Client-Id": config['client_id'],
                "Authorization": "Bearer " + config['oauth'],
                "Content-Type": "application/json",
            },
            mode: 'cors',
            body: JSON.stringify({
                "type": "channel.follow",
                "version": "1",
                "condition": { "broadcaster_user_id": config['user_id'] },
                "transport": { "method": "websocket", "session_id": message["payload"]["session"]["id"] }
            })
        }
    )
        .then((response) => response.json())
        .then((data) => console.log(data))
}

function notification_callback(message) {
    if (message.metadata.subscription_type == "channel.follow") {
        follower.innerHTML = message["payload"]["event"]["user_name"]
        notification.classList.remove("hidden")
        sfx.addEventListener("ended", function () {
            notification.classList.add("hidden")
        })
        sfx.play()
    }
}

let lookup = {
    "session_welcome": subscribe_to_events,
    "session_keepalive": () => { },
    "session_reconnect": () => { },
    "revocation": () => { },
    "notification": notification_callback,
}

function message(event) {
    let message = JSON.parse(event.data)
    console.log('RECV: ' + JSON.stringify(message))
    lookup[message["metadata"]["message_type"]](message)
}

function close(event) {
    console.log('INFO: Socket Closed')
    console.log('INFO: Reconnecting...')
    setTimeout(connect, 1000 * 10)
}

function connect() {
    ws = new WebSocket(ws_endpoint)
    ws.addEventListener("open", open)
    ws.addEventListener("message", message)
    ws.addEventListener("error", error)
    ws.addEventListener("close", close)
}

connect()

if (new URL(window.location.href).hash == "#test") {
    notification_callback({
        "metadata": {
            "message_type": "notification",
            "subscription_type": "channel.follow",
        },
        "payload": {
            "event": {
                "user_name": "test name",
            }
        }
    })
}