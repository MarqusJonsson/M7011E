import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { config } from 'src/app/config';

@Injectable({ providedIn: 'root' })
export class UploadProfilePictureService {
	public static readonly ALLOWED_MIME_TYPES_REGEX = /^image\/(apng|avif|gif|jpeg|png|svg|webp)$/;

	constructor(private http: HttpClient) {}

	upload(file: File) {
		if (file.type.match(UploadProfilePictureService.ALLOWED_MIME_TYPES_REGEX) === null) {
			return throwError(new Error('Invalid file type!'));
		}
		const formData: FormData = new FormData();
		const operations = {
			query: `mutation ($picture: Upload!) {
				uploadProfilePicture (picture: $picture)
			}`,
			variables: {
				file: null
			}
		};
		const map = {
			0: ['variables.picture']
		};
		formData.append('operations', JSON.stringify(operations));
		formData.append('map', JSON.stringify(map));
		formData.append('0', file);


		const request = new HttpRequest('POST', config.URL_GRAPHQL, formData, {
			reportProgress: true,
			responseType: 'json'
		});

		return this.http.request(request).pipe(
			catchError(error => {
				// TODO: Should probably not return this error directly
				return throwError(error);
			})
		);
	}
}
