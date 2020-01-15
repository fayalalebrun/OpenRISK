function main(){
    let nick = window.localStorage.getItem('nick');
    if(!nick){
	nick = "Guest";
    }
    window.localStorage.setItem('nick',nick);
    $('#nickname').val(nick);

    $('#joinGame').click(()=>{
	window.localStorage.setItem('nick',$('#nickname').val());
	window.location.href='lobby';
	window.sessionStorage.setItem('createLobbyOptions', null);
    });

    $('#createGameButton').click(()=>{
	window.localStorage.setItem('nick',$('#nickname').val());
	let options = {};
	
	options.title = $('#gameTitle').val();
	options.maxCap = $('#maxPlayers').val();

	window.sessionStorage.setItem('createLobbyOptions', JSON.stringify(options));
	window.location.href='play';
    });
}

$(document).ready(main);
