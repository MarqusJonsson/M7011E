import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
	providedIn: 'root'
})

export class GraphqlService {
	private subscriberCallbacks: ((data: any) => void)[] = [];
	private newSubscriberCallbacks: ((data: any) => void)[] = [];
	private singleFetchCallbacks: ((data: any) => void)[] = [];
	private newSingleFetchCallbacks: ((data: any) => void)[] = [];
	private queryInterval: NodeJS.Timeout;
	constructor(private apollo: Apollo) { }

	public query(query: any, variables?: any) {
		return this.apollo.query({
			query: gql`${query}`,
			variables: variables,
			fetchPolicy: 'network-only'
		}).pipe(
			map((response) => {
				return response.data;
			}),
			catchError((error) => {
				return EMPTY;
			})
		);
	}

	public mutate(mutation: any, variables?: any) {
		if (variables !== undefined) {
			return this.apollo.mutate({
				mutation: gql`${mutation}`,
				variables: variables
			}).pipe(map((response: any) => {
				return response.data;
			}));
		}
		else {
			return this.apollo.mutate({
				mutation: gql`${mutation}`
			}).pipe(map((response: any) => {
				return response.data;
			}));
		}
	}

	public startQueryInterval(query: any, ms: number) {
		this.stopQueryInterval();
		this.queryAndNotifySubscribers(query).subscribe();
		this.queryInterval = setInterval(() => {
			// Add new callbacs
			if (this.newSubscriberCallbacks.length > 0) {
				this.subscriberCallbacks.push(...this.newSubscriberCallbacks);
				this.newSubscriberCallbacks.length = 0;
			}
			if (this.newSingleFetchCallbacks.length > 0) {
				this.singleFetchCallbacks.push(...this.singleFetchCallbacks);
				this.newSingleFetchCallbacks.length = 0;
			}
			this.queryAndNotifySubscribers(query).subscribe();
		}, ms);
	}

	public stopQueryInterval() {
		if (this.queryInterval !== undefined) {
			clearInterval(this.queryInterval);
		}
	}

	private queryAndNotifySubscribers(query: any) {
		return this.query(query).pipe(
			map((data: any) => {
				if (data !== undefined) {
					this.subscriberCallbacks.forEach((callback) => {
						callback(data);
					});
					this.singleFetchCallbacks.forEach((callback) => {
						callback(data);
					})
					this.singleFetchCallbacks.length = 0;
				}
				return data;
			})
		);
	}

	public addSingleFetchCallback(callback: (data: any) => void) {
		this.singleFetchCallbacks.push(callback);
	}

	public addSubscriberCallback(callback: (data: any) => void) {
		this.subscriberCallbacks.push(callback);
	}

	public removeAllSubscriberCallbacks() {
		this.subscriberCallbacks.length = 0;
	}
}
