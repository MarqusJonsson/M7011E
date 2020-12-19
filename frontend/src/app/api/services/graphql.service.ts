import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
	providedIn: 'root'
})

export class GraphqlService {
	subscriberCallBacks: ((data: any) => void)[] = [];
	private queryInterval: NodeJS.Timeout;
	constructor(private apollo: Apollo) { }

	query(query: any, variables?: any) {
		return this.apollo.query({
			query: gql`${query}`,
			variables: variables,
			fetchPolicy: 'network-only'
		}).pipe(
			map((response) => {
				return response.data;
			}),
			catchError((error) => {
				return of(undefined);
			})
		);
	}

	startQueryInterval(query: any, ms: number) {
		this.stopQueryInterval();
		this.queryInterval = setInterval(() => {
			this.queryAndNotifySubscribers(query).subscribe();
		}, ms);
	}

	stopQueryInterval() {
		if (this.queryInterval !== undefined) {
			clearInterval(this.queryInterval);
		}
	}

	queryAndNotifySubscribers(query: any) {
		return this.query(query).pipe(
			map((data: any) => {
				if (data !== undefined) {
					this.subscriberCallBacks.forEach((callback) => {
						callback(data);
					});
				}
				return data;
			})
		);
	}

	addSubscriberCallBack(callback: (data: any) => void) {
		this.subscriberCallBacks.push(callback);
	}

	mutate(mutation: any, variables: any) {
		return this.apollo.mutate({
			mutation: gql`${mutation}`,
			variables: variables
		});
	}
}
