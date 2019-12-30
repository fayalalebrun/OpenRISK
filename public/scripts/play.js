let playerList = JSON.parse(window.sessionStorage.getItem('lobbyPlayerNames'));
playerList.forEach((name)=>{
    $('.mainSection').append($('<p>').text(name));
});

let createLobbyOptions = window.sessionStorage.getItem('createLobbyOptions');


var socket = new WebSocket('ws://'+window.location.host);

socket.onopen = (() => {
    socket.send(JSON.stringify({setNickname:window.sessionStorage.getItem('nick')}));
    
    let msg = {};
    
    if(createLobbyOptions){
	let lobby = msg.createLobby = createLobbyOptions;
	socket.send(JSON.stringify(msg));
    } else {
	let join = msg.joinLobby = {};
	join.gameID = window.sessionStorage.getItem('joinGameID');
	socket.send(JSON.stringify(msg));	
    }
});

socket.onmessage = ((event)=>{
    let msg = JSON.parse(event.data);

    if(msg.lobbyReadyToStart){
	//ready to go
    } else if (msg.playerJoinLobby) {
	$('.mainSection').append($('<p>').text(msg.playerJoinLobby));
    } else if (msg.joinError){
	//give error
    } else if (msg.playerLeftGame){
	//trouble
    }
});
