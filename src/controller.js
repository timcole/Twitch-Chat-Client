var fs = require('fs');
var path = require('path');
var fetch = require('node-fetch');

var exports = module.exports = {};

exports.webserver = (req, res) => {
	var resolvedBase = path.resolve("dist");
	var safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
	var fileLoc = path.join(resolvedBase, safeSuffix);

	var stream = fs.createReadStream(fileLoc);

	stream.on('error', function (error) {
		res.writeHead(404, 'Not Found');
		res.write('404: File Not Found!');
		res.end();
	});

	res.statusCode = 200;
	stream.pipe(res);
}

exports.chatters = async (socket, data) => {
	if (typeof data !== "object") return;
	if (!data.channel) return;

	try {
		var tmi = await fetch(`https://tmi.twitch.tv/group/user/${data.channel.toLowerCase()}/chatters`).then(j => { return j.json() });
		socket.emit("chatters", { channel: data.channel, chatters: tmi.chatters });
	} catch(err) {
		socket.emit("chatters", { err });
	}
}

exports.subscribe = (socket, data) => {
	if (typeof data !== "object") return;

	console.log(data)
};