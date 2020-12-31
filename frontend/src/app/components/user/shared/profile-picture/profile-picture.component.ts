import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StatusCode } from 'src/app/models/statusCode';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { config } from 'src/app/config';

@Component({
	selector: 'app-profile-picture',
	templateUrl: './profile-picture.component.html',
	styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent implements OnInit {
	profilePictureSrc: string | ArrayBuffer = '/assets/profile-picture-placeholder.svg';

	constructor(private authService: AuthenticationService, private httpClient: HttpClient) {}

	ngOnInit(): void {
		const url = config.URL_PROFILE_PICTURE(this.authService.getId());
		this.httpClient.get(url, { observe: 'response', responseType: 'blob' }).pipe(
			catchError((error) => {
				return of(undefined);
			})
		).subscribe((response: HttpResponse<Blob>) => {
			switch (response.status) {
				case StatusCode.OK:
					const image = response.body;
					if (image === undefined) { return; }
					let reader = new FileReader();
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
