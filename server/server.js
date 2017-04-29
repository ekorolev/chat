const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const static = require("express-static");
const path = require("path");

app.use(static( path.join(__dirname, "../public/") ));

server.listen(7050, function () {
	console.log("Сервер запущен");
});

io.on("connection", function (socket) {
	console.log("Сокет подключен");
});