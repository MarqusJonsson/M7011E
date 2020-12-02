export function randomFromInterval(min: number, max: number) { // [min, max)
	return Math.random() * (max - min) + min;
}
