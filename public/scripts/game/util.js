export function randomIntFromInterval(min, max, rand) {
  return Math.floor(rand() * (max - min + 1) + min);
}
