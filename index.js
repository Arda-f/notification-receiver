const express = require('express');
const app = express();
const socketio = require("socket.io");

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor. Port: ${PORT}`);
});

const io = socketio(server);

let decodedTitle;
let decodedText;

app.post('/', (req, res) => {

    let encodedTitle = req.body.title;
    let encodedText = req.body.text;

    // Başlık ve metni UTF-8 formatına dönüştür
    decodedTitle = decodeURIComponent(encodedTitle);
    decodedText = decodeURIComponent(encodedText);

    if (decodedTitle !== "Klavye seç" && decodedTitle !== "WhatsApp pili kullanıyor") {
        console.log(req.body)
        const final = {
            device: req.ip.split(":")[3].toString(),
            title: decodedTitle,
            content: decodedText
        };
        send(final);
    }
    res.status(200).send('Mesaj alındı.');
});

function send(data) {
    io.emit("new-notification", data);
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log("Bir istemci bağlandı");
});
