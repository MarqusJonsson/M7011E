import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { config } from '../../config';

@Injectable()
export default class UserDataInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Only add user to header if the request is to the simulator server
		if (!request.url.startsWith(config.URL_SIMULATOR_SERVER)) {
			return next.handle(request);
		}
		// Add user id and role to header
		const user = this.authService.getUser();
		if (user !== null) {
			console.log(user);
			request = this.addUserData(request, { id: user.id, role: user.role });
		}
		return next.handle(request);
	}

	private addUserData(request: HttpRequest<any>, user: any) {
		return request.clone({
			setHeaders: {
				user: JSON.stringify(user)
				// 'Content-Type': 'application/json'
			}
		});
	}
}
