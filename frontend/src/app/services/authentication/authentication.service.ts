import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { config } from 'src/app/config';
import { Tokens } from 'src/app/models/authentication/tokens';
import { AuthenticationError } from 'src/app/models/authentication/authenticationError';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

export enum UserRole {
	PROSUMER = 0,
	MANAGER = 1
}

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	private user: {id: number, role: UserRole};

	public static getAccessToken() {
		return localStorage.getItem(ACCESS_TOKEN);
	}

	public static getRefreshToken() {
		return localStorage.getItem(REFRESH_TOKEN);
	}

	private static setSession(data: Tokens) {
		AuthenticationService.setAccessToken(data.accessToken);
		AuthenticationService.setRefreshToken(data.refreshToken);
	}

	private static removeSession() {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);
	}

	private static setRefreshToken(value: string) {
		localStorage.setItem(REFRESH_TOKEN, value);
	}

	public static setAccessToken(value: string) {
		localStorage.setItem(ACCESS_TOKEN, value);
	}

	constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

	public register(email: string, password: string) {
		return this.http.post<any>(config.URL_REGISTER, { email, password })
		.pipe(
			map((response) => {
				if (!response.success) {
					throw new AuthenticationError('Unknown error');
				}
				AuthenticationService.setSession(response.body);
				return response.success;
			}),
			catchError((error) => {
				if (error instanceof AuthenticationError) {
					return throwError(error);
				}
				return throwError(new AuthenticationError(error.error.message));
		}));
	}

	public login(email: string, password: string) {
		return this.http.post<any>(config.URL_LOGIN, { email, password })
		.pipe(
			map((response) => {
				if (!response.success) {
					throw new AuthenticationError('Unknown error');
				}
				AuthenticationService.setSession(response.body);
				return response.success;
			}),
			catchError((error) => {
				if (error instanceof AuthenticationError) {
					return throwError(error);
				}
				return throwError(new AuthenticationError(error.error.message));
			})
		);
	}

	public logout() {
		return this.http.delete<any>(config.URL_LOGOUT) // Refresh token is in Authorization header, see jwt interceptor
			.pipe(
				finalize(() => {
					AuthenticationService.removeSession();
					this.clearUser();
				})
			);
	}

	public refreshAccessToken() {
		return this.http.get<any>(config.URL_REFRESH_ACCESS_TOKEN) // Refresh token is in Authorization header, see jwt interceptor
			.pipe(tap((response) => {
				AuthenticationService.setAccessToken(response.body.accessToken);
			}));
	}

	public getUser() {
		if (this.user === undefined) {
			const payload = this.jwtHelper.decodeToken(AuthenticationService.getRefreshToken());
			if (!payload) {
				return undefined;
			}
			this.user = payload.user;
		}
		return this.user;
	}

	public getRole(): number {
		if (this.user === undefined) {
			this.getUser();
			if (this.user === undefined) {
				return undefined;
			}
		}
		return this.user.role;
	}

	private clearUser() {
		this.user = undefined;
	}

	public getId(): number {
		if (this.user === undefined) {
			this.getUser();
		}
		return this.user.id;
	}

	public authorizedProsumer(): boolean {
		return this.authorizeRole(UserRole.PROSUMER);
	}

	public authorizedManager(): boolean {
		return this.authorizeRole(UserRole.MANAGER);
	}

	private authorizeRole(role: number) {
		const userRole = this.getRole();
		if (userRole === role) {
			if (this.authorizeTokens()) {
				return true;
			}
		}
		return false;
	}

	private authorizeTokens(): boolean {
		const accessExpired: boolean = this.jwtHelper.isTokenExpired(AuthenticationService.getAccessToken());
		const refreshExpired: boolean = this.jwtHelper.isTokenExpired(AuthenticationService.getRefreshToken());
		if (refreshExpired && accessExpired) {
			return false;
		}
		return true;
	}
}
