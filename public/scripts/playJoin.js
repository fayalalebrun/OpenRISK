console.log(window.location.pathname);
let str = window.location.pathname.split('/play/');
if(str.length>1){
    window.sessionStorage.setItem('joinGameID', str[1]);
    window.sessionStorage.setItem('createLobbyOptions', null);
    let nick = window.localStorage.getItem('nick');
    if(!nick){
	nick = window.prompt('Enter a nickname');
    }
    if(nick===''){
	nick="Guest";
    }
    window.localStorage.setItem('nick',nick);

    window.location.href='../play';
}

