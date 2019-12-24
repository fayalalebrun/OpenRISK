import util from "./util.js";

export class Actor {
    constructor(scene, x, y, z, width, height, rotation, scale, img){
	this.scene = scene;
	this.x = x;
	this.y = y;
	this.z = z;
	this.width = width;
	this.height = height;
	this.rotation = rotation;
	this.img = img;
	this.children = [];
    }
    
    _transformContext(ctx){
	ctx.translate(this.x,this.y);
	ctx.translate(this.width/2, this.height/2);
	ctx.rotate(this.rotation);
	ctx.translate(-this.width/2,-this.height/2);
	ctx.scale(this.scale,this.scale);
    }

    draw(ctx) {
	this._transformContext(ctx);

	ctx.drawImage(this.img,0,0);

	this.children.sort(util.zLevelComparator);
	
	this.children.forEach(function(child){
	    ctx.save();
	    child.draw(ctx);
	    ctx.restore();
	});
    }

    eventHitTest(ctx,event,x,y) {
	this._transformContext(ctx);

	this.children.sort(util.zLevelComparator);
	if (this.children.some(function(child){
	    ctx.save();
	    let res = child.eventHitTest(ctx,event,x,y);
	    ctx.restore();
	    return res;
	})) {
	    return true;
	}
	return util.rectContainsCoordinates(ctx, this.width, this.height, x, y) && this.onHit(ctx);
    }

    onHit(ctx) {
	console.log('hit me');
	return false;    } //override this function to do something on mouse hit

    addChild(actor){
	this.children.push(actor);
    }
    
    
};
