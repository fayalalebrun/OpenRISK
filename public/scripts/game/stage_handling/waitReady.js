import {StageHandler} from './stageHandler.js';
import * as game from '../game.js';
import {map} from "../mapFunctions.js";
import {TakeOne} from "./takeOne.js";

export class WaitReady extends StageHandler{
    static onPlayerEvent(event){
	if(event.waitReady){
	    WaitReady.readyClients++;

	    if(WaitReady.readyClients===game.players.length){
		TakeOne.select();
	    }
	} else {
	    console.error('Unsupported event type received');
	}
    }

    static select(){
	game.setStageHandler(this);
	WaitReady.readyClients = 0;
	game.setGameStatus('Waiting for other players');
    }

    static ready(){
	game.gamePlayerEventSource.sendMessage({waitReady:true});
    }
}
