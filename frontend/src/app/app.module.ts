import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/containers/login/login.component';
import { AlertComponent } from './alert/containers/alert/alert.component';
import { ProsumerPageComponent } from './users/prosumer/containers/prosumer-page/prosumer-page.component';
import { AccountSettingsComponent } from './users/shared/containers/account-settings/account-settings.component';
import { NavBarComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/nav-bar/nav-bar.component';
import { VisualBlockComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/visual-block/visual-block.component';
import { PageBlockComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/page-block/page-block.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    ProsumerPageComponent,
    AccountSettingsComponent,
    NavBarComponent,
    VisualBlockComponent,
    PageBlockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
