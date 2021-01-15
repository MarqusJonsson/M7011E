import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { AlertService } from '../../../services/alert/alert.service';
import { AuthenticationError } from '../../../models/authentication/authenticationError';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css', '../shared/form-card.css']
})
export class RegisterComponent implements OnInit {
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
				updateOn: 'change'
			}),
			password: new FormControl('', {
				validators: [Validators.required],
				updateOn: 'change'
			})
		});
	}

	get f() { return this.form.controls; }

	register() {
		if (this.form.invalid) {
			return;
		}
		this.loading = true;
		this.authService.register(this.form.value.email, this.form.value.password).subscribe(
			(success) => {
				this.loading = false;
				if (success === true) {
					this.alertService.success('Registration successful', { autoClose: true, keepAfterRouteChange: true });
					this.router.navigateByUrl('/prosumer');
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
					console.log(error.message);
				}
				return EMPTY;
			}
		);
	}
}
