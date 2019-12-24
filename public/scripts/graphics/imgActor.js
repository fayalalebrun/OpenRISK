import Actor from './actor.js';

export class ImgActor extends Actor {
    constructor(scene, x, y, z, rotation, scale, img){
	super(scene, x, y, z, img.width, img.height, rotation, scale);
	this.img = img;
    }

    do_draw (ctx) {
	ctx.drawImage(this.img,0,0);
    }
}
