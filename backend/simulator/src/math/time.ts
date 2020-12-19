export class YMDHMSM {
	constructor(
		public years: number = 0,
		public months: number = 0,
		public days: number = 0,
		public hours: number = 0,
		public minutes: number = 0,
		public seconds: number = 0,
		public miliseconds: number = 0,
	) {}
		
	public plus(ms: number): YMDHMSM {
		return ms_to_YMDHMSM(YMDHMSM_to_ms(this) + ms);
	}
}

export function YMDHMSM_to_ms(time: YMDHMSM): number {
	return time.years * 31536000000 // 31 557 600 000 ms per year
		+ time.days * 86400000 // 86 400 000 ms per day
		+ time.hours * 3600000 // 3 600 000 ms per hour
		+ time.minutes * 60000 // 60 000 ms per minute
		+ time.miliseconds
}

export function ms_to_YMDHMSM(ms: number): YMDHMSM {
	const zeroDate = new Date(0);
	const msDate = new Date(ms);
	return new YMDHMSM(
		msDate.getFullYear() - zeroDate.getFullYear(),
		msDate.getMonth(),
		msDate.getDate() - zeroDate.getDate(),
		msDate.getHours() - zeroDate.getHours(),
		msDate.getMinutes(),
		msDate.getSeconds(),
		msDate.getMilliseconds()
	);
}
