import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class ProsumerGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router){}

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.authService.authorizedProsumer()) {
		return true;
		} else {
		return this.router.parseUrl('/401');
		}
	}
}
