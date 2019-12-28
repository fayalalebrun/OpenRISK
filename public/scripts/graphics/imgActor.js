/**
 * @fileOverview Contains the ImgActor class.
 * @name imgActor.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import {Actor} from './actor.js';

export class ImgActor extends Actor {
    constructor(parent, x, y, z, rotation, scale, img){
	super(parent, x, y, z, img.width, img.height, rotation, scale);
	this.img = img;
    }

    
    do_draw (ctx) {
	ctx.drawImage(this.img,0,0);
    }
}
