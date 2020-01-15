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
	options.visible = $('#trigger').is(":checked");

	window.sessionStorage.setItem('createLobbyOptions', JSON.stringify(options));
	window.location.href='play';
    });

    validateInput();

    $('#maxPlayers').on('change',validateInput);
}

$(document).ready(main);


function validateInput(){
    let value = $('#maxPlayers').val();    
    if(value>=2&&value<=6){
	$('#createGameButton').removeClass('disabled');
    } else {
	$('#createGameButton').addClass('disabled');
    }

}
