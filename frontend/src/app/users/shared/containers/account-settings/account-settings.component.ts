import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../auth/services/auth.service"
@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
  }
  public checkLoginStatus(): string{
    if(this.authService.authCheck()){
      return "Logged in as " + this.authService.getEmail();
    }
      return "Currently not logged in";
  }
  

}
