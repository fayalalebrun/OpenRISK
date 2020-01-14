/**
 * @fileOverview Contains TextActor class.
 * @name textActor.js
 * @author Francisco Ayala Le Brun <frankxlebrun@gmail.com>
 */

import {Actor} from './actor.js';

export class TextActor extends Actor {
    constructor(parent, x, y, z, rotation, scale, text, fillStyle = 'black', font='10px sans-serif', textAlign='start',
		textBaseline='alphabetic',direction='inherit'){
	super(parent, x, y, z, 0, 0, rotation, scale);
	this.text = text;
	this.fillStyle = fillStyle;
	this.font = font;
	this.textAlign = textAlign;
	this.textBaseline = textBaseline;
	this.direction = direction;
    }

    do_draw (ctx) {
	ctx.fillStyle = this.fillStyle;
	ctx.font = this.font;
	ctx.textAlign = this.textAlign;
	ctx.textBaseline = this.textBaseline;
	ctx.direction = this.direction;
	ctx.strokeStyle = "#FF0000";
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 8;
	ctx.strokeText(this.text, 0, 0);
	ctx.fillText(this.text, 0, 0);
    }
};
