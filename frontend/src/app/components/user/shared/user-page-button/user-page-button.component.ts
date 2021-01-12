import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, UserRole } from 'src/app/services/authentication/authentication.service';

@Component({
	selector: 'user-page-button',
	templateUrl: './user-page-button.component.html',
	styleUrls: ['./user-page-button.component.css', '../nav-bar/nav-bar.component.css']
})
export class UserPageButtonComponent implements OnInit {
	userPageUrl: string;

	constructor(private router: Router, private authenticationServie: AuthenticationService) {}

	ngOnInit(): void {
		switch (this.authenticationServie.getRole()) {
			case UserRole.MANAGER:
				this.userPageUrl = '/manager-page';
				break;
			case UserRole.PROSUMER:
				this.userPageUrl = '/prosumer-page';
			}
	}
}
