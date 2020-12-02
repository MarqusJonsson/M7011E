import { Component, OnInit} from '@angular/core';
;
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from "../../../../alert/services/alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private alertService: AlertService,private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    //Redirect from login page if already logged in
    this.form = this.formBuilder.group({
    email: ['',Validators.required],
    password: ['',Validators.required]
    });
  }

  login() {
    this.alertService.clear();
    if (this.form.invalid) {
      this.alertService.error("Invalid form credentials");
    }
    else{
      this.router.navigateByUrl('prosumerPage');
    }
  }

  redirectToRegistration() {
    this.router.navigateByUrl("registration");
  }
}
