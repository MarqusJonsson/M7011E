import { HistoryModel } from './history'
export interface User extends HistoryModel{
	id: number,
	email: string,
	password: string,
	role: string
}