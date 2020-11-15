class YMDHMSM {
	public years: number = 0;
	public months: number = 0;
	public days: number = 0;
	public hours: number = 0;
	public minutes: number = 0;
	public seconds: number = 0;
	public miliseconds: number = 0;
}

export function msToYMDHMSM(ms: number): YMDHMSM {
	const zeroDate = new Date(0);
	const msDate = new Date(ms);
	return {
		years: msDate.getFullYear() - zeroDate.getFullYear(),
		months: msDate.getMonth(),
		days: msDate.getDate() - zeroDate.getDate(),
		hours: msDate.getHours() - zeroDate.getHours(),
		minutes: msDate.getMinutes(),
		seconds: msDate.getSeconds(),
		miliseconds: msDate.getMilliseconds()
	}
}
