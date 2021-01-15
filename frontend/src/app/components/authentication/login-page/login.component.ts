import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthenticationService, UserRole } from 'src/app/services/authentication/authentication.service';
import { AuthenticationError } from '../../../models/authentication/authenticationError';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css', '../shared/form-card.css']
})
export class LoginComponent implements OnInit {
	form: FormGroup;
	loading = false;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authService: AuthenticationService,
		private alertService: AlertService
	) {}

	ngOnInit(): void {
		if (AuthenticationService.getRefreshToken() !== null) {
			this.authService.logout();
		}
		this.form = this.formBuilder.group({
			email: new FormControl('', {
				validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/)],
				updateOn: 'blur'
			}),
			password: new FormControl('', {
				validators: [Validators.required],
				updateOn: 'blur'
			})
		});
	}

	get f() { return this.form.controls; }

	login() {
		if (this.form.invalid) {
			this.f.email.markAsTouched();
			this.f.password.markAsTouched();
			return;
		}
		this.loading = true;
		this.authService.login(this.form.value.email, this.form.value.password).subscribe(
			(success) => {
				if (success === true) {
					this.loading = false;
					this.alertService.success('Login successful', { autoClose: true, keepAfterRouteChange: true });
					switch (this.authService.getRole()) {
						case UserRole.MANAGER:
							this.router.navigateByUrl('manager');
							break;
						case UserRole.PROSUMER:
							this.router.navigateByUrl('prosumer');
						}
				} else {
					throw new Error('Unknown error');
				}
			},
			(error) => {
				this.loading = false;
				if (error instanceof AuthenticationError) {
					this.alertService.error(error.message, { autoClose: true });
				} else {
					this.alertService.error(error.message, { autoClose: true });
				}
				return EMPTY;
			});
	}
}
