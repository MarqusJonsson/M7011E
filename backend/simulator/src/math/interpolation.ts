import { Location } from '../buildings/components/geoData';

export function calc1DInterpolationConstants(x1: number, x2: number, x: number): number[] {
	const dist_x1_x2 = x2 - x1;
	const dist_x_x2 = x2 - x;
	if(dist_x_x2 === 0){
		return [0, 1];
	}
	const x_x1 = dist_x_x2 / dist_x1_x2;
	return [x_x1, 1-x_x1];
}

export function apply1DInterpolation(c: number[], h1:number, h2: number) {
	const h = c[0] * h1 + c[1] * h2;
	return h;
}

export function bilinearInterpolation(q11_x: number, q11_y: number, h11: number, q21_x: number, q21_y: number, h21: number, q12_x: number, q12_y: number, h12: number, q22_x: number, q22_y: number, h22: number, p_x: number, p_y: number) {
	const r1c_x = calc1DInterpolationConstants(q11_x, q21_x, p_x);
	const r1h_x = apply1DInterpolation(r1c_x, h11, h21);
	const r1h_y = r1h_x;
	const r2c_x = calc1DInterpolationConstants(q12_x, q22_x, p_x);
	const r2h_x = apply1DInterpolation(r2c_x, h12, h22);
	const r2h_y = r2h_x;
	const p_c_y = calc1DInterpolationConstants(q11_y,q12_y,p_y);
	const hp = apply1DInterpolation(p_c_y, r1h_y, r2h_y);
	return hp;
}

export function geoDatabilinearInterpolation(q11: Location, q11Value: number, q21: Location, q21Value: number, q12: Location, q12Value: number, q22:Location, q22Value: number, p: Location){
	return bilinearInterpolation(q11.longitude, q11.latitude, q11Value, q21.longitude, q21.latitude, q21Value, q12.longitude, q12.latitude, q12Value, q22.longitude, q22.latitude, q22Value, p.longitude, p.latitude);
}

export function bilinearTest(){
	let n = 5;
	let heatpoints: (number | null)[][] = [];
	for (let i = 0; i < n; i++) {
		let row: (number | null)[] = [];
		for(let j = 0; j < n; j++) {
			row.push(null);
		}
		heatpoints.push(row);
	}
	heatpoints[0][0] = 1;
	const q11_y = 0;
	const q11_x = 0;
	const h11 = heatpoints[0][0];

	heatpoints[0][n-1] = 0;
	const q12_y = n-1;
	const q12_x = 0;
	const h12 = heatpoints[0][n-1];

	heatpoints[n-1][0] = 0;
	const q21_y = 0;
	const q21_x = n-1;
	const h21 = heatpoints[n-1][0];

	heatpoints[n-1][n-1] = 0 ;
	const q22_y = n-1;
	const q22_x = n-1;
	const h22 = heatpoints[n-1][n-1];
	console.log(heatpoints);
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if(heatpoints[i][j] === null)
				heatpoints [i][j] = bilinearInterpolation(q11_x, q11_y, h11, q21_x, q21_y, <number>h21, q12_x, q12_y, <number>h12, q22_x, q22_y, <number>h22, i, j);
		}
	}
	console.log(heatpoints);
}
