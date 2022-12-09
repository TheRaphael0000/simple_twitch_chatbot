const chat = document.querySelector("#chat")

let max_messages = 10
let max_time = 15 * 1000
let id = 0


function add_message(channel, tags, message, self) {
    let date = Date.now()

    let tr = document.createElement("tr")
    tr.classList.add("message", "show", "bg")
    tr.dataset.date = date

    let user_td = document.createElement("td")
    user_td.classList.add("user", "accent")
    user_td.innerHTML = tags["display-name"]

    let text_td = document.createElement("td")
    text_td.id = "text_" + id
    text_td.classList.add("text")

    tr.appendChild(user_td)
    tr.appendChild(text_td)
    chat.appendChild(tr)

    new Typed('#text_' + id, { strings: [message], typeSpeed: 10, showCursor: false })
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


let watcher = setInterval(remove_message, 500)

const client = new tmi.Client({
    channels: [config['channel']]
});

client.connect();

client.on('message', add_message);
