import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/authentication/login-page/login.component';
import { LogoutButtonComponent } from './components/user/shared/logout-button/logout-button.component';
import { SettingsButtonComponent } from './components/user/shared/settings-button/settings-button.component';
import { UserPageButtonComponent } from './components/user/shared/user-page-button/user-page-button.component';
import { AlertComponent } from './components/alert/alert.component';
import { ProsumerPageComponent } from './components/user/prosumer-page/prosumer-page.component';
import { ManagerPageComponent } from './components/user/manager-page/manager-page.component';
import { SettingsPageComponent } from './components/user/settings-page/settings-page.component';
import { NavBarComponent } from './components/user/shared/nav-bar/nav-bar.component';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphComponent } from './components/user/shared/cards/battery/graph/graph.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './components/authentication/register-page/register.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthenticationService } from './services/authentication/authentication.service';
import JwtInterceptor from './interceptors/jwt.interceptor';
import { GraphQLModule } from './graphql.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { UploadProfilePictureComponent } from './components/user/shared/upload-profile-picture/upload-profile-picture.component';
import { ProfilePictureComponent } from './components/user/shared/profile-picture/profile-picture.component';
import { BatteryCardComponent } from './components/user/shared/cards/battery/battery-card.component';
import { GeoDataCardComponent } from './components/user/shared/cards/geo-data/geo-data-card.component';
import { UserCardComponent } from './components/user/shared/cards/user/user-card.component';
import { PowerPlantCardComponent } from './components/user/shared/cards/power-plant/power-plant-card.component';
import { HouseCardComponent } from './components/user/shared/cards/house/house-card.component';
import { BuildingAnimationCardComponent } from './components/user/shared/cards/building-animation/building-animation-card.component';
import { ProsumerListCardComponent } from './components/user/manager-page/cards/prosumer-list/prosumer-list-card.component';
import { ProsumerListEntryComponent } from './components/user/manager-page/cards/prosumer-list/prosumer-list-entry/prosumer-list-entry.component';
import { config } from './config';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		AlertComponent,
		ProsumerPageComponent,
		ManagerPageComponent,
		SettingsPageComponent,
		NavBarComponent,
		GraphComponent,
		RegisterComponent,
		DialogComponent,
		LogoutButtonComponent,
		UploadProfilePictureComponent,
		ProfilePictureComponent,
		SettingsButtonComponent,
		UserPageButtonComponent,
		BatteryCardComponent,
		GeoDataCardComponent,
		UserCardComponent,
		PowerPlantCardComponent,
		HouseCardComponent,
		BuildingAnimationCardComponent,
		ProsumerListCardComponent,
		ProsumerListEntryComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MatSliderModule,
		HttpClientModule,
		JwtModule.forRoot({
			config: {
				tokenGetter: AuthenticationService.getAccessToken,
				allowedDomains: ['https://localhost:4200', config.URL_SIMULATOR_SERVER, config.URL_AUTH_SERVER]
			}
		}),
		GraphQLModule,
		MatDialogModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: JwtInterceptor,
			multi: true
		}
	],
	entryComponents: [DialogComponent],
	bootstrap: [AppComponent],
})
export class AppModule {}
