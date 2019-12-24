import util from "./util.js";

export class Scene{
    constructor(stage, x, y, z, width, height, rotation){
	this.stage = stage;
	this.x = x;
	this.y = y;
	this.z = z;
	this.width = width;
	this.height = height;
	this.rotation = rotation;
	this.actors = [];
    }

    _transformContext(ctx){
	ctx.translate(this.x,this.y);
	ctx.translate(this.width/2,this.height/2);
	ctx.rotate(this.rotation);
	ctx.translate(-this.width/2,-this.height/2);
	
    }

    draw(ctx){
	this._transformContext(ctx);

	this.actors.forEach(function(actor){
	    ctx.save();	    
	    actor.draw(ctx);
	    ctx.restore();
	});
    };

    eventHitTest(ctx,event,x,y){
	this._transformContext(ctx);

	if(!util.rectContainsCoordinates(ctx, this.width, this.height, x, y)){
	    return false;
	}
	
	return this.actors.some(function(actor){
	    ctx.save();	    
	    let res = actor.eventHitTest(ctx,event,x,y);
	    ctx.restore();
	    return res;
	});
    };
    
    addActor(actor) {
	this.actors.push(actor);
    };

};

