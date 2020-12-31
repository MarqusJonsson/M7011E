import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { config } from 'src/app/config';
import { catchError, map } from 'rxjs/operators';
import { deleteProsumerMutation } from 'src/app/models/graphql/prosumer';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Injectable({
	providedIn: 'root'
})
export class DeleteProsumerService {

	constructor(private graphqlService: GraphqlService, private http: HttpClient, private alertService: AlertService) { }

	public deleteProsumer(id: number) {
		return this.http.delete<any>(config.URL_DELETE_USER + `${id}`).pipe(
			map((response) => {
				if (response.success === false) {
					// throw new Error('Delete user failed');
				}
				this.graphqlService.mutate(deleteProsumerMutation, {id: id}).subscribe();
				return true;
			}), catchError((error) => {
				this.alertService.error('Failed to delete user');
				return of(false);
			}));
	}
}
