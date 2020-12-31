import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { HttpClient } from '@angular/common/http';
import { deleteProsumerMutation } from 'src/app/api/models/mutations/prosumerMutations';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { catchError, map } from 'rxjs/operators';
import { of} from 'rxjs';
import { AlertService } from 'src/app/alert/services/alert.service';

@Injectable({
	providedIn: 'root'
})
export class DeleteProsumerService {

	constructor(private graphqlService: GraphqlService, private http: HttpClient, private alertService: AlertService) { }

	public deleteProsumer(id: number) {
		return this.http.delete<any>(config.URL_DELETE_USER + `${id}`).pipe(
			map( (response) => {
				if (response.success === false) {
					console.log(response.success, "in IF")
					//throw new Error("Delete user failed");
				}
				//this.graphqlService.mutate(deleteProsumerMutation, {id: id}).subscribe();
				return true;
			}), catchError((error) => {
				console.log(error, "in catcherror")
				this.alertService.error("Failed to delete user");
				return of(false);
			}));
	}
}
