import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AlertService } from 'src/app/alert/services/alert.service';
import { AuthService, UserRole } from 'src/app/auth/services/auth.service';
import { AuthError } from '../../models/authError';

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
		private authService: AuthService,
		private alertService: AlertService
	) {}

	ngOnInit(): void {
		if (AuthService.getRefreshToken() !== null) {
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

	onSubmit() {
		if (this.form.invalid) {
			this.f.email.markAsTouched();
			this.f.password.markAsTouched();
			return;
		}
		this.authService.login(this.form.value.email, this.form.value.password).subscribe(
			(success) => {
				if (success === true) {
					this.alertService.success('Login successful', { autoClose: true, keepAfterRouteChange: true });
					switch (this.authService.getRole()) {
						case UserRole.MANAGER:
							this.router.navigateByUrl('manager-page');
							break;
						case UserRole.PROSUMER:
							this.router.navigateByUrl('prosumer-page');
						}
				} else {
					throw new Error('Unknown error');
				}
			},
			(error) => {
				if (error instanceof AuthError) {
					this.alertService.error(error.message, { autoClose: true });
				} else {
					this.alertService.error(error.message, { autoClose: true });
					console.error(error);
				}
				return of(error);
			});
	}
}
