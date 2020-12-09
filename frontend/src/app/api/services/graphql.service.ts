import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';


@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
error: any;
  constructor(private apollo: Apollo) { }
  ngOnInit(){
    this.apollo.watchQuery({
      query: gql `
        {
          graphql(currency: "USD) {

          }
        }
      `,
    }).valueChanges.subscribe(result => {
      this.error = result.error;
    })
  }
}
