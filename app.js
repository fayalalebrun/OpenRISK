const express = require("express");
const http = require("http");
const websocket = require("ws");
var cookies = require("cookie-parser");

const port = process.argv[2];
const app = express();

let games = {};

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookies());

app.get('/', (req, res) => {
    if(!req.cookies||!req.cookies.timesVisited){
	res.cookie('timesVisited',1);
	req.cookies.timesVisited=0;
    } else {
	res.cookie('timesVisited',Number(req.cookies.timesVisited)+1);
    }    
    
    res.render('splash.ejs',{gamesInitialized:gamesStarted,playersJoined:currConnectionID, timesVisited:Number(req.cookies.timesVisited)+1});
});

app.get('/play/', (req, res) => {
    res.sendFile(__dirname + "/public/" + 'play.html');
});

app.get('/play/:id', (req, res) => {
    res.sendFile(__dirname + "/public/" + 'playJoin.html');
});

app.get('/lobby', (req, res) => {
    res.sendFile(__dirname + "/public/" + 'lobby.html');
});

app.get('/games', (req, res) => {
    res.send(JSON.stringify(Object.entries(games).filter(([k,v])=>!v.started&&v.visible)));
});

app.get('/games/:id', (req, res) => {
    res.send(JSON.stringify(games[req.params.id]));    
});

const server = http.createServer(app).listen(process.env.PORT || 3000);

const wss = new websocket.Server({server});

var currConnectionID = 0;
var gamesStarted = 0;
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
		gamesStarted++;
		let newGameID = Buffer.from(String((Date.now()>>>8)%1000000)).toString('base64');
		let game = games[newGameID]={};
		game.id = newGameID;
		game.title = msg.title;
		game.players = {};
		game.players[con.id]=con.nick;
		game.maxCap = msg.maxCap;
		game.mapInfo = msg.mapInfo;
		game.host = con.id;
		game.started = false;
		game.visible = msg.visible;
		con.game = game;
		con.send(JSON.stringify({gameID:newGameID}));
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
			let seed = Date.now();
			Object.keys(game.players).forEach((e)=>{
			    let out = {};
			    let lobbyReady = out.lobbyReadyToStart = {};
			    lobbyReady.seed = seed;
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
	    } else if (oMsg.heartbeat){

		con.send(JSON.stringify({heartbeat:true}));
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

