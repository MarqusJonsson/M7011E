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
	const r1c_y = calc1DInterpolationConstants(q11_y, q12_y, q12_y);
	const r1h_x = apply1DInterpolation(r1c_x, h11, h21);
	const r1h_y = apply1DInterpolation(r1c_y, h11, h21);

	const r2c_x = calc1DInterpolationConstants(q12_x, q22_x, p_x);
	const r2c_y = calc1DInterpolationConstants(q12_y, q22_y, q12_y);
	const r2h_x = apply1DInterpolation(r2c_x, h12, h22);
	const r2h_y = apply1DInterpolation(r2c_y, h12, h22);

	const p_c_y = calc1DInterpolationConstants(q11_y,q12_y,p_y);
	const hp = apply1DInterpolation(p_c_y, r1h_y, r2h_y);
	return hp;



}
