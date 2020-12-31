import { Injectable } from '@angular/core';
import { config } from 'src/app/config';
import { HttpClient } from '@angular/common/http';
import { deleteProsumerMutation } from 'src/app/api/models/mutations/prosumerMutations';
import { GraphqlService } from 'src/app/api/services/graphql.service';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class DeleteProsumerService {

	constructor(private graphqlService: GraphqlService, private http: HttpClient) { }

	public deleteProsumer(id: number) {
		return this.http.delete<any>(config.URL_DELETE_USER + `${id}`).pipe(map( (response) => {
			if (response.success === false) {
				//TODO Add error handling
				throw new Error("TODO ERROR DELETE PROSUMER");
			}
			return this.graphqlService.mutate(deleteProsumerMutation, {id: id}).subscribe();
		}));
	}
}
