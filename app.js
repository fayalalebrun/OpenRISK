const express = require("express");
const http = require("http");
const websocket = require("ws");

const port = process.argv[2];
const app = express();

let games = [];

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + 'game.html');
});

app.get('/games', (req, res) => {
    res.send(JSON.stringify(games));
});

const server = http.createServer(app);

const wss = new websocket.Server({server});

var currConnectionID = 0;
var currGameID = 0;
var connections = {};

wss.on("connection", (ws) => {
    let con = ws;
    con.id = currConnectionID++;
    con.send(JSON.stringify({assignID:con.id}));
    connections[con.id] = con;

    
    con.on("message", (message) => {
	let oMsg = JSON.parse(message);
	if (oMsg.setNickname){
	    let msg = oMsg.setNickname;
	    con.nick = msg;	    
	} else if (oMsg.createLobby){
	    let msg = oMsg.createLobby;
	    let game = games[currGameID++]={};
	    game.players = {};
	    game.players[con.id]=con.nick;
	    game.maxCap = msg.maxCap;
	    game.mapInfo = msg.mapInfo;
	    con.send(JSON.stringify({gameID:currGameID-1}));
	} else if (oMsg.joinLobby) {
	    let msg = oMsg.joinLobby;
	    let game = games[msg.gameID];	    
	    if(Object.keys(game.players).length<game.maxCap){
		
		game.players.forEach((e)=>{
		    connections[e].send(JSON.stringify({playerJoinLobby:game.players[con.id]}));
		});
		
		game.players.push(con.id);

		if(Object.keys(game.players).length==game.maxCap){
		    game.players.forEach((e)=>{
			connections[e].send(JSON.stringify({lobbyReadyToStart:null}));
		    });
		}
	    } else {
		con.send(JSON.stringify({joinError:'Lobby full'}));
	    }
	}
    });
});


server.listen(port);
