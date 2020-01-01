import {MapNode} from "./mapNode.js";

export class Map {
    constructor(mapData){
	this.nodes = this._buildNodes(mapData.nodes);
	this.connections = this._buildConnections(mapData.connections, mapData.nodes.length);
	this.zones = mapData.zones;
    }

    _buildNodes(nodeData){
	return nodeData.map((e)=>{
	    return new MapNode(e.name, e.color, e.x, e.y);
	});
    }

    _buildConnections(connectionData, nodeAmount){
	let matrix = [];

	// create the matrix
	for(let i = 0; i < nodeAmount; i++) {
	    matrix.push([]);
	}

	// set every position in the  matrix to false
	for(let i = 0; i < nodeAmount; i++) {
	    for(let z = 0; z < nodeAmount; z++) {
		matrix[i][z]=false;
	    }	    
	}

	connectionData.forEach((e)=>{
	    matrix[e.from][e.to] = true;
	    if(e.type==='b'){
		matrix[e.to][e.from] = true;
	    }
	});

	return matrix;
    }
}
