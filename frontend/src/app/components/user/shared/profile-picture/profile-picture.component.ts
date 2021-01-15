import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StatusCode } from 'src/app/models/statusCode';
import { AuthenticationService, UserRole } from 'src/app/services/authentication/authentication.service';
import { config } from 'src/app/config';

@Component({
	selector: 'app-profile-picture',
	templateUrl: './profile-picture.component.html',
	styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent implements OnInit {
	public profilePictureSrc: string | ArrayBuffer = '/assets/profile-picture-placeholder.svg';
	@Input() userId: number;

	constructor(private authService: AuthenticationService, private httpClient: HttpClient) {}

	ngOnInit(): void {
		let id: number;
		let role: number;
		if (this.userId !== undefined) {
			// If userId is set, it means that a manager is trying to view a prosumers picture
			// This is not well structured due to time constraints
			id = this.userId;
			role = UserRole.PROSUMER;
		} else {
			id = this.authService.getId();
			role = this.authService.getRole();
		}
		const url = config.URL_PROFILE_PICTURE(role, id);
		this.httpClient.get(url, { observe: 'response', responseType: 'blob' }).pipe(
			catchError((error) => {
				return EMPTY;
			})
		).subscribe((response: HttpResponse<Blob>) => {
			switch (response.status) {
				case StatusCode.OK:
					const image = response.body;
					if (image === undefined) { return EMPTY; }
					const reader = new FileReader();
					reader.addEventListener('load', () => {
						this.profilePictureSrc = reader.result;
					}, false);
					if (image) {
						reader.readAsDataURL(image);
					}
					break;
				case StatusCode.NO_CONTENT:
				default:
			}
		});
	}
}
