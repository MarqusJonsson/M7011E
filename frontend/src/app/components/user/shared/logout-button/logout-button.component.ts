import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
	selector: 'logout-button',
	templateUrl: './logout-button.component.html',
	styleUrls: ['./logout-button.component.css', '../../shared/nav-bar/nav-bar.component.css']
})
export class LogoutButtonComponent {
	constructor(private authService: AuthenticationService, private router: Router, private graphQLService: GraphqlService){}

	logout() {
		this.graphQLService.stopQueryInterval();
		this.graphQLService.removeAllSubscriberCallbacks();
		this.authService.logout().subscribe(() => {
			this.router.navigateByUrl('/login'); // Redirect when ready
		});
		return false; // return false so user do not get redirected from clicking anchor tag
	}
}
