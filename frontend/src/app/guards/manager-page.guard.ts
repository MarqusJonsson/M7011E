import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class ManagerPageGuard implements CanActivate {
	constructor(private authService: AuthenticationService, private router: Router){}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.authService.authorizedManager()) {
			return true;
		} else {
			return this.router.parseUrl('/');
		}
	}
}
