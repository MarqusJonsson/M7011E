import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Component({
	selector: 'app-logout-button',
	templateUrl: './logout.component.html',
	styleUrls: [`./logout.component.css`]
})
export class LogoutComponent implements OnInit {
	constructor(private authService: AuthenticationService, private router: Router, private graphQLService: GraphqlService){}

	ngOnInit(): void {
	}

	logout() {
		this.graphQLService.stopQueryInterval();
		this.graphQLService.removeAllSubscriberCallbacks();
		this.authService.logout().subscribe(() => {
			this.router.navigateByUrl('/login'); // Redirect when ready
		});
		return false; // return false so user do not get redirected from clicking anchor tag
	}
}
