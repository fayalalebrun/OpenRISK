import * as graphics from "../graphics/graphics.js";

export class MapUnits extends graphics.TextActor {
    constructor(parent, z, rotation, scale, node){
	super(parent, node.x, node.y, z, rotation, scale, "");
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
