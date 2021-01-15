import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { config } from '../config';
import { StatusCode } from '../models/statusCode';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { GraphqlService } from '../services/graphql/graphql.service';
import { Router } from '@angular/router';

@Injectable()
export default class JwtInterceptor implements HttpInterceptor {

	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(
		private authService: AuthenticationService,
		private graphQLSerivce: GraphqlService,
		private alertService: AlertService,
		private router: Router
	) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (request.url === config.URL_LOGIN || request.url === config.URL_REGISTER) {
			// Do not add Authorization header
			return next.handle(request);
		} else if (request.url === config.URL_LOGOUT || request.url === config.URL_REFRESH_ACCESS_TOKEN) {
			// Add Authorization header with refresh token
			request = this.addToken(request, AuthenticationService.getRefreshToken());
			return next.handle(request);
		}
		// Add Authorization header with access token
		request = this.addToken(request, AuthenticationService.getAccessToken());

		return next.handle(request).pipe(
			catchError((error) => {
				if (error instanceof HttpErrorResponse) {
					switch (error.status) {
						case StatusCode.UNAUTHORIZED:
							return this.handleUnauthorizedError(request, next);
						case StatusCode.FORBIDDEN:
							return this.handleForbiddenError(request, next);
					}
				}
			})
		);
	}

	private addToken(request: HttpRequest<any>, token: string) {
		return request.clone({
			setHeaders: {
				Authorization: 'Bearer ' + token,
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
					return next.handle(this.addToken(request, accessToken));
				}),
				catchError((error) => {
					switch (error.status) {
						case StatusCode.FORBIDDEN:
							this.graphQLSerivce.stopQueryInterval();
							this.alertService.error('Session expired! Please login again.');
						}
					return throwError(error);
				})
			);
		} else {
			return this.refreshTokenSubject.pipe(
				filter((response) => response != null),
				take(1),
				switchMap((accessToken) => {
					AuthenticationService.setAccessToken(accessToken);
					return next.handle(request);
				})
			);
		}
	}

	private handleForbiddenError(request: HttpRequest<any>, next: HttpHandler) {
		return this.authService.logout().pipe(
			finalize(() => {
				this.alertService.error('Access denied, session has been terminated', { keepAfterRouteChange: true });
				this.graphQLSerivce.stopQueryInterval();
				this.router.navigateByUrl('/login');
			})
		);
	}
}
