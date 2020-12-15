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

	query(query: any, variables?: any) {
		return this.apollo.query({
			query: gql`${query}`,
			variables: variables,
			fetchPolicy: 'network-only'
		}).pipe(map((response) => {
			return response.data;
		}));
		//TODO error handling
	}

	queryAndNotifySubscribers(query: any) {
		return this.query(query).pipe(
			map((data: any) => {
				this.subscriberCallBacks.forEach((callback) => {
					callback(data);
				});
				return data;
			})
		);
	}

	addSubscriberCallBack(callback: (data:any) => void) {
		this.subscriberCallBacks.push(callback);
	}
}
