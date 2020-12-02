export interface History {
	id: number,
	createdAt: Date,
	updatedAt: Date
}

export interface HistoryModel {
	history: History
}