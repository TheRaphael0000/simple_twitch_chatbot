const chat = document.querySelector("#chat")

let max_messages = 10
let max_time = 15 * 1000
let id = 0

function add_message(channel, tags, message, self) {
    let date = Date.now()
    console.log(tags)

    let tr = document.createElement("tr")
    tr.classList.add("message", "show")
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

    let message_with_emotes = getMessageHTML(message, tags)

    new Typed('#text_' + id, { strings: [message_with_emotes], typeSpeed: 10, showCursor: false })
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


/* https://www.stefanjudis.com/blog/how-to-display-twitch-emotes-in-tmi-js-chat-messages */
function getMessageHTML(message, { emotes }) {
    if (!emotes) return message;

    // store all emote keywords
    // ! you have to first scan through 
    // the message string and replace later
    const stringReplacements = [];

    // iterate of emotes to access ids and positions
    Object.entries(emotes).forEach(([id, positions]) => {
        // use only the first position to find out the emote key word
        const position = positions[0];
        const [start, end] = position.split("-");
        const stringToReplace = message.substring(
            parseInt(start, 10),
            parseInt(end, 10) + 1
        );

        stringReplacements.push({
            stringToReplace: stringToReplace,
            replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0">`,
        });
    });

    // generate HTML and replace all emote keywords with image elements
    const messageHTML = stringReplacements.reduce(
        (acc, { stringToReplace, replacement }) => {
            // obs browser doesn't seam to know about replaceAll
            return acc.split(stringToReplace).join(replacement);
        },
        message
    );

    return messageHTML;
}


let watcher = setInterval(remove_message, 500)

const client = new tmi.Client({
    channels: [config['channel']]
});

client.connect();

client.on('message', add_message);
