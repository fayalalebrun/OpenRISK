window.sessionStorage.setItem('createLobbyOptions', null);
const games = $.getJSON('./games', (data)=>{
    data.forEach(([k,e])=>{
	if(e){	  
	    let $info = $('<p>');
	    $info.text(e.title + " | " + Object.keys(e.players).length + "/" + e.maxCap);
	    let $button = $('<label class="labelButton">');
	    $button.text("join");
	    $info.append($button);
	    $('.games').append($info);

	    $button.on("click", (event)=>{
		console.log("Redirection to join game" + e.id);
		window.sessionStorage.setItem('joinGameID', e.id);
		window.sessionStorage.setItem('createLobbyOptions', null);
		window.location.href='play';
	    });
	}
    });
});
