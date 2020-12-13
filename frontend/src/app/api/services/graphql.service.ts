import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class GraphqlService {
	subscriberCallBacks: ((data: any) => void)[] = [];
	constructor(private apollo: Apollo) { }
	ngOnInit(){}
	query(queryContent: any) {
		return this.apollo.query({
			query: gql`${queryContent}` 
		}).pipe(
			map((response: any) => {
				this.subscriberCallBacks.forEach((callback) => {
					callback(response.data);
				})
				return response.data;
			})
		);
	}

	addSubscriberCallBack(callback: (data:any) => void) {
		this.subscriberCallBacks.push(callback);
	}
}
