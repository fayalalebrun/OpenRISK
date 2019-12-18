if(typeof graphics === 'undefined'){
    graphics = {};
}

graphics.Actor = function (scene, x, y, z, width, height, rotation, scale, img) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.img = img;
    this.children = [];

    let actor = this;

    this.draw = function(ctx) {
	ctx.transform(x,y);
	ctx.transform(width/2,height/2);
	ctx.rotate(rotation);
	ctx.transform(-width/2,-height/2);
	ctx.scale(scale);

	ctx.drawImage(actor.img,0,0);

	actor.children.sort(graphics.util.zLevelComparator);
	
	actor.children.forEach(function(child){
	    ctx.save();
	    child.draw();
	    ctx.restore();
	});
    };
};
