const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const static = require("express-static");
const path = require("path");

app.use(static( path.join(__dirname, "../public/") ));
app.use(function (req, res, next) {
	res.sendFile(path.join(__dirname, "../public/index.html"));
});

server.listen(7050, function () {
	console.log("Сервер запущен");
});

function sendMsg(msg) {
	io.sockets.emit("message", msg);
}

io.on("connection", function (socket) {
	console.log("Сокет подключен");

	socket.on("message", function (data) {
		sendMsg(data);
	});

	socket.on("mynameis", function (nickname) {
		console.log("Сокет авторизовался как ", nickname);
		socket.nickname = nickname;
		sendMsg({type: "system", text: `Пользователь ${nickname} вошел в игру`})
	});
});