import { HistoryModel } from './history'
import { User } from './user';

export interface RefreshToken extends HistoryModel {
	id: number,
	token: string,
	user: User
}
