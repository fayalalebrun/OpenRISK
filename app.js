const express = require("express");
const http = require("http");
const websocket = require("ws");

const port = process.argv[2];
const app = express();

let games = [];

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + 'splash.html');
});

app.get('/play', (req, res) => {
    res.sendFile(__dirname + "/public/" + 'play.html');
});

app.get('/lobby', (req, res) => {
    res.sendFile(__dirname + "/public/" + 'lobby.html');
});

app.get('/games', (req, res) => {
    res.send(JSON.stringify(games.filter(g=>!g.started)));
});

app.get('/games/:id', (req, res) => {
    res.send(JSON.stringify(games[req.params.id]));    
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
		console.log('Player %s[%s] has connected',con.nick,con.id);
		con.send(JSON.stringify({conID:con.id}));
	    } else if (oMsg.createLobby){
		let msg = oMsg.createLobby;
		let game = games[++currGameID]={};
		game.id = currGameID;
		game.title = msg.title;
		game.players = {};
		game.players[con.id]=con.nick;
		game.maxCap = msg.maxCap;
		game.mapInfo = msg.mapInfo;
		game.host = con.id;
		game.started = false;
		con.game = game;
		con.send(JSON.stringify({gameID:currGameID}));
		console.log('Game created: %s', JSON.stringify(game));
	    } else if (oMsg.joinLobby) {
		let msg = oMsg.joinLobby;
		let game = games[msg.gameID];	    
		if(game&&Object.keys(game.players).length<game.maxCap&&!game.started){

		    game.players[con.id]=con.nick;
		    con.game = game;
		    
		    Object.keys(game.players).forEach((e)=>{
			connections[e].send(JSON.stringify({playerJoinLobby:game.players[con.id]}));
		    });
		    
		    console.log('Player %s joined game %s',con.id,game.id);
		    if(Object.keys(game.players).length===Number(game.maxCap)){
			game.started = true;
			Object.keys(game.players).forEach((e)=>{
			    let out = {};
			    let lobbyReady = out.lobbyReadyToStart = {};
			    lobbyReady.seed = Date.now();
			    connections[e].send(JSON.stringify(out));
			});
			console.log('Game filled %s',game.id);
		    }
		} else if(!game){
		    console.log('Game does not exist: Player %s[%s] tried to join game',con.nick,con.id);
		    con.close();
		} else if (game.started){
		    console.log('Game already started: Player %s[%s] tried to join game'+game.id,con.nick,con.id);
		} else {
		    console.log('Lobby full: Player %s[%s] tried to join game'+game.id,con.nick,con.id);
		    con.send(JSON.stringify({joinError:'Lobby full'}));
		}
	    } else if (oMsg.playerMessage) {
		let msg = oMsg.playerMessage;
		msg.playerID = con.id;

		Object.keys(con.game.players).forEach((e)=>{
		    connections[e].send(JSON.stringify(oMsg));
		});
	    }
	});

    con.on("close", (ws) =>{
	console.log("Player %s[%s] disconnected", con.nick, con.id);

	if(con.game){	    
	    delete con.game.players[con.id];

	    Object.keys(con.game.players).forEach((e)=>{
		if(connections[e].readyState === websocket.OPEN){
		    connections[e].send(JSON.stringify({playerLeftGame:con.id}));
		}
	    });

	    if(con.game.host === con.id && Object.keys(con.game.players).length>0){
		con.game.host = Object.keys(con.game.players)[0];
		console.log('Game '+con.game.id+': '+'host %s[%s] replaced by %s[%s]', con.nick, con.id, Object.values(con.game.players)[0], Object.keys(con.game.players)[0]);
	    } else if (Object.keys(con.game.players).length==0){
		console.log('Game '+con.game.id+': all players left, terminating game');
		delete games[con.game.id];
	    }
	}
    });
});


server.listen(port);
