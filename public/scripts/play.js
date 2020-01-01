let createLobbyOptions = window.sessionStorage.getItem('createLobbyOptions');


var socket = new WebSocket('ws://'+window.location.host);

socket.onopen = (() => {
    socket.send(JSON.stringify({setNickname:window.localStorage.getItem('nick')}));
    
    let msg = {};
    
    if(createLobbyOptions&&createLobbyOptions!='null'){
	let lobby = msg.createLobby = JSON.parse(createLobbyOptions);
	socket.send(JSON.stringify(msg));
    } else {
	let join = msg.joinLobby = {};
	join.gameID = window.sessionStorage.getItem('joinGameID');
	socket.send(JSON.stringify(msg));
	addNames(join.gameID);
	console.log(join.gameID);
    }
});

socket.onmessage = ((event)=>{
    let msg = JSON.parse(event.data);


    if(msg.lobbyReadyToStart){
	//ready to go
    } else if (msg.gameID){
	window.sessionStorage.setItem('joinGameID', msg.gameID);
	addNames(window.sessionStorage.getItem('joinGameID'));
    } else if (msg.playerJoinLobby||msg.playerLeftGame!=undefined) {
	addNames(window.sessionStorage.getItem('joinGameID'));
    } else if (msg.joinError){
	//give error
    } else if (msg.playerLeftGame){
	//trouble
    }
});


async function addNames(id){
    let gameData = await $.getJSON('games/'+id);
    $('.playerNames').empty();
    Object.values(gameData.players).forEach((name)=>{
	console.log(name);
	$('.playerNames').append($('<p>').text(name));
    });
}
