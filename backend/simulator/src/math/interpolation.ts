import { Location } from '../buildings/components/geoData';

export function linearInterpolation(x: number, y: number, a: number) {
	return x * (1 - a) + y * a
}

export function calculateLinearInterpolationConstants(x1: number, x2: number, x: number): number[] {
	const dist_x1_x2 = x2 - x1;
	const dist_x_x2 = x2 - x;
	if(dist_x_x2 === 0){
		return [0, 1];
	}
	const x_x1 = dist_x_x2 / dist_x1_x2;
	return [x_x1, 1-x_x1];
}

export function applyLinearInterpolationConstants(c: number[], h1:number, h2: number) {
	const h = c[0] * h1 + c[1] * h2;
	return h;
}

export function bilinearInterpolation(q11_x: number, q11_y: number, v11: number, q21_x: number, q21_y: number, v21: number, q12_x: number, q12_y: number, v12: number, q22_x: number, q22_y: number, v22: number, p_x: number, p_y: number) {
	const r1c_x = calculateLinearInterpolationConstants(q11_x, q21_x, p_x);
	const r1v_y = applyLinearInterpolationConstants(r1c_x, v11, v21);
	const r2c_x = calculateLinearInterpolationConstants(q12_x, q22_x, p_x);
	const r2v_y = applyLinearInterpolationConstants(r2c_x, v12, v22);
	const p_c_y = calculateLinearInterpolationConstants(q11_y, q12_y, p_y);
	return applyLinearInterpolationConstants(p_c_y, r1v_y, r2v_y);
}

export function geoDatabilinearInterpolation(q11: Location, q11Value: number, q21: Location, q21Value: number, q12: Location, q12Value: number, q22:Location, q22Value: number, p: Location){
	return bilinearInterpolation(q11.longitude, q11.latitude, q11Value, q21.longitude, q21.latitude, q21Value, q12.longitude, q12.latitude, q12Value, q22.longitude, q22.latitude, q22Value, p.longitude, p.latitude);
}
