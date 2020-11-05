export abstract class Identifiable {
	private readonly _id: number;
	private readonly _type: string;
	private static _map: Map<string, number> = new Map<string, number>();

	constructor(typeName: string) {
		let nextId: number | undefined = Identifiable.getNextId(typeName);
		if (nextId === undefined) {
			nextId = 1;
		}
		this._id = nextId;
		this._type = typeName;
		nextId++;
		Identifiable.setNextId(typeName, nextId)
	}

	private static getNextId(typeName: string): number | undefined {
		return Identifiable._map.get(typeName);
	}

	private static setNextId(typeName: string, value: number) {
		Identifiable._map.set(typeName, value);
	}

	public get id() {
		return this._id;
	}

	public get type() {
		return this._type;
	}
}
