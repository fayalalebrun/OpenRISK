
export class StageHandler {
    
    /**
     * @abstract 
     */
    static onPlayerEvent(event){}    

    /**
     * @abstract 
     */
    static handleInput(currPlayer, zone, mapView, game){}

    
    /**
     * @abstract 
     */
    static select(){}    
}
