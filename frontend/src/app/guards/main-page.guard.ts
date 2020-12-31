import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class MainPageGuard implements CanActivate {

	constructor(private authService: AuthenticationService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.authService.authorizedProsumer()) {
			return this.router.parseUrl('/prosumer-page');
		} else if (this.authService.authorizedManager()) {
			return this.router.parseUrl('/manager-page');
		} else {
			return this.router.parseUrl('/login');
		}
	}
}
