const Ws_per_kWh = 3600000;
export function Ws_to_kWh(Ws: number): number {
	return Ws / Ws_per_kWh;
}
export function kWh_to_Ws(kWh: number): number {
	return kWh * Ws_per_kWh;
}