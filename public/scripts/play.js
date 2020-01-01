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
    }
});

socket.onmessage = ((event)=>{
    let msg = JSON.parse(event.data);


    if(msg.lobbyReadyToStart){
	//ready to go
	console.log('ready');
    } else if (msg.gameID){
	window.sessionStorage.setItem('joinGameID', msg.gameID);
	addNames(window.sessionStorage.getItem('joinGameID'));
    } else if (msg.playerJoinLobby||msg.playerLeftGame!=undefined) {
	addNames(window.sessionStorage.getItem('joinGameID'));
    } else if (msg.joinError){
	$('body').append($('<dialog open>Error joining.</dialog>'));
    }
});

socket.onclose = ((event)=>{
    console.log('connection closed');
    $('body').append($('<dialog open>Connection to server lost.</dialog>'));
});


async function addNames(id){
    let gameData = await $.getJSON('games/'+id);
    $('.playerNames').empty();
    Object.values(gameData.players).forEach((name)=>{
	$('.playerNames').append($('<p>').text(name));
    });
}
