import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { config } from 'src/app/config';
import { catchError, map } from 'rxjs/operators';
import { deleteProsumerMutation } from 'src/app/models/graphql/prosumer';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { StatusCode } from 'src/app/models/status-code';

@Injectable({
	providedIn: 'root'
})
export class ProsumerService {

	constructor(private graphqlService: GraphqlService, private http: HttpClient, private alertService: AlertService) { }

	public delete(id: number) {
		return this.http.delete<any>(config.URL_USERS + `${id}`).pipe(
			map((response) => {
				if (response.success === false) {
					// throw new Error('Delete user failed');
				}
				this.graphqlService.mutate(deleteProsumerMutation, {id}).subscribe();
				return true;
			}), catchError((error) => {
				this.alertService.error('Failed to delete user', { autoClose: true });
				return of(false);
			})
		);
	}

	public updateEmail(id: number, email: string) {
		return this.http.put<any>(config.URL_UPDATE_EMAIL(id), { email }).pipe(
			map(() => {
				this.alertService.success(`Email updated to ${email} for prosumer ${id}`, { autoClose: true });
				return true;
			}), catchError((error) => {
				if (error.status === StatusCode.CONFLICT) {
					this.alertService.error('Email already in use', { autoClose: true });
				} else {
					this.alertService.error('Failed to update email', { autoClose: true });
				}
				return of(false);
			})
		);
	}

	public updatePassword(id: number, password: string) {
		return this.http.put<any>(config.URL_UPDATE_PASSWORD(id), { password }).pipe(
			map((response) => {
				this.alertService.success(`Password updated successfully for prosumer ${id}`, { autoClose: true });
				return true;
			}), catchError((error) => {
				this.alertService.error('Failed to update password', { autoClose: true });
				return of(false);
			})
		);
	}
}
