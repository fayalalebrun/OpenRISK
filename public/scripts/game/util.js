export function randomIntFromInterval(min, max, rand) {
  return Math.floor(rand() * (max - min + 1) + min);
}

export function shuffle(array, rand){
    
    for (let i = array.length - 1; i > 0; i--) {
	let j = Math.floor(rand() * (i + 1));
	[array[i], array[j]] = [array[j], array[i]];
	
    }
}
