const controller = require("./src/controller.js");

const server = require("http").createServer(controller.webserver);
const io = require("socket.io")(server);

io.use((socket, next) => {
	if (socket.request.headers.cookie) return next();
	next(new Error('Authentication error'));
});

io.on("connection", connection => {
	connection.emit("connected", { status: "ok" });

	connection.on("chatters", data => controller.chatters(connection, data));
	connection.on("subscribe", data => controller.subscribe(connection, data));
});

server.listen(8086);