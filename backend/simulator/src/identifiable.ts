export class Identifier {
	public type: string;
	public id: number;
	
	constructor(type: string, id: number) {
		this.type = type;
		this.id = id;
	}
}

export abstract class Identifiable {
	private static _map: Map<string, number> = new Map<string, number>();
	private _identifier: Identifier;

	constructor(type: string) {
		let id: number | undefined = Identifiable.getNextId(type);
		if (id === undefined) {
			id = 1;
		}
		this._identifier = new Identifier(type, id);
		Identifiable.setNextId(type, id + 1)
	}

	private static getNextId(type: string): number | undefined {
		return Identifiable._map.get(type);
	}

	private static setNextId(type: string, value: number) {
		Identifiable._map.set(type, value);
	}

	public get identifier() {
		return this._identifier;
	}

	public get id() {
		return this._identifier.id;
	}

	public get type() {
		return this._identifier.type;
	}
}

export class IMap<T extends Identifiable> extends Map<number, T> {
	public iSet(identifiable: T) {
		return this.set(identifiable.id, identifiable);
	}

	public iGet(identifiable: T): T | undefined {
		return this.get(identifiable.id);
	}

	public uGet(identifier: Identifier): T | undefined {
		return this.get(identifier.id);
	}
}
