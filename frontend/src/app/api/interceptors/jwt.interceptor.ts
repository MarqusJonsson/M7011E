import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { StatusCode } from '../statusCode';
import { AuthService } from '../../auth/services/auth.service';
import { config } from '../../config';

@Injectable()
export default class JwtInterceptor implements HttpInterceptor {

	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(private authService: AuthService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Do not add Authorization header to login and register request
		if (request.url === config.URL_LOGIN || request.url === config.URL_REGISTER) {
			return next.handle(request);
		}
		// Add Authorization header with access token
		request = this.addAccessToken(request, AuthService.getAccessToken());

		return next.handle(request).pipe(
			catchError((error) => {
				if (error instanceof HttpErrorResponse) {
					switch (error.status) {
						case StatusCode.UNAUTHORIZED:
						return this.handleUnauthorizedError(request, next);
					}
				}
				return throwError(error);
			})
		);
	}

	private addAccessToken(request: HttpRequest<any>, accessToken: string) {
		return request.clone({
			setHeaders: {
				Authorization: 'Bearer ' + accessToken,
				// 'Content-Type': 'application/json'
			}
		});
	}

	private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler) {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);
			return this.authService.refreshAccessToken().pipe(
				switchMap((response) => {
					const accessToken = response.body.accessToken;
					this.isRefreshing = false;
					this.refreshTokenSubject.next(accessToken);
					return next.handle(this.addAccessToken(request, accessToken));
				}));
		} else {
			return this.refreshTokenSubject.pipe(
				filter((response) => response != null),
				take(1),
				switchMap((accessToken) => {
					AuthService.setAccessToken(accessToken);
					return next.handle(request);
				})
			);
		}
	}
}
