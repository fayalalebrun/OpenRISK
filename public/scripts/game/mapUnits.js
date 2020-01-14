import * as graphics from "../graphics/graphics.js";
import * as game from "./game.js";
export class MapUnits extends graphics.TextActor {
    constructor(parent, z, rotation, scale, node){
	super(parent, node.x, node.y, z, rotation, scale, "", 'black', '50px rexlia');
	this.node = node;
    }

    do_draw (ctx){
	if(this.node.owner){	    
	    this.fillStyle=this.node.owner.color;
	    this.text = String(this.node.troopNumber);
	    
	    super.do_draw(ctx);

	}
    }
}
