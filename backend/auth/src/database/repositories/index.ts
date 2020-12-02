import { HistoryRepository } from './history';
import { UsersRepository } from './users';
import { RefreshTokenRepository } from './refreshToken';

interface IExtensions {
	refreshTokens: RefreshTokenRepository;
	histories: HistoryRepository;
	users: UsersRepository;
}

export {
	IExtensions,
	RefreshTokenRepository,
	HistoryRepository,
	UsersRepository
};
