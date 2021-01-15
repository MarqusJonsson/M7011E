import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class SettingsPageGuard implements CanActivate {

	constructor(private authService: AuthenticationService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.authService.authorizedProsumer() || this.authService.authorizedManager()) {
			return this.router.parseUrl('/settings');
		} else {
			return this.router.parseUrl('/');
		}
	}
}
