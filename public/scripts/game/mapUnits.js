import * as graphics from "../graphics/graphics.js";
import * as game from "./game.js";
export class MapUnits extends graphics.TextActor {
    constructor(parent, z, rotation, scale, node){
	super(parent, node.x, node.y, z, rotation, scale, "", 'black', '50px rexlia');
	this.node = node;
    }

    do_draw (ctx){
	if(this.node.owner){
	    var charImg = false;

	    ctx.save();
	    ctx.scale(0.15,0.15);
	    if(this.node.troopNumber>=10){
		charImg = game.spriteMap[this.node.owner.color]['units5'];
	    } else if (this.node.troopNumber>=5){
		charImg = game.spriteMap[this.node.owner.color]['units3'];
		ctx.translate(-100,0);
	    } else {
		charImg = game.spriteMap[this.node.owner.color]['units1'];
	    }



	    ctx.translate(-150,-100);
	    ctx.drawImage(charImg,-charImg.width/2,-charImg.height/2);

	    ctx.restore();
	    
	    this.fillStyle=this.node.owner.color;
	    this.text = String(this.node.troopNumber);
	    
	    super.do_draw(ctx);
	    
	}
    }
}
