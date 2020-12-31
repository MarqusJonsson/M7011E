import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { LogoutComponent } from './components/authentication/logout/logout.component';
import { AlertComponent } from './components/alert/alert.component';
import { ProsumerPageComponent } from './components/user/prosumer-page/prosumer-page.component';
import { AccountSettingsComponent } from './components/user/shared/account-settings/account-settings.component';
import { NavBarComponent } from './components/user/prosumer-page/prosumer-page-children/nav-bar/nav-bar.component';
import { VisualBlockComponent } from './components/user/prosumer-page/prosumer-page-children/visual-block/visual-block.component';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphComponent } from './components/user/shared/graph/graph.component';
import { RatioBlockComponent } from './components/user/prosumer-page/prosumer-page-children/ratio-block/ratio-block.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './components/authentication/register/register.component';
import { ManagerPageComponent } from './components/user/manager-page/manager-page.component';
import { ManagerNavBarComponent } from './components/user/manager-page/manager-page-children/manager-nav-bar/manager-nav-bar.component';
import { ManagerMainBlockComponent } from './components/user/manager-page/manager-page-children/manager-main-block/manager-main-block.component';
import { PowerPlantBlockComponent } from './components/user/manager-page/manager-page-children/power-plant-block/power-plant-block.component';
import { ManagerMarketComponent } from './components/user/manager-page/manager-page-children/manager-market/manager-market.component';
import { ProsumerCurrencyBlockComponent } from './components/user/prosumer-page/prosumer-page-children/prosumer-currency-block/prosumer-currency-block.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthenticationService } from './services/authentication/authentication.service';
import JwtInterceptor from './interceptors/jwt.interceptor';
import { GraphQLModule } from './graphql.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { UploadProfilePictureComponent } from './components/user/shared/upload-profile-picture/upload-profile-picture.component';
import { ProfilePictureComponent } from './components/user/shared/profile-picture/profile-picture.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		AlertComponent,
		ProsumerPageComponent,
		AccountSettingsComponent,
		NavBarComponent,
		VisualBlockComponent,
		GraphComponent,
		RatioBlockComponent,
		RegisterComponent,
		ManagerPageComponent,
		ManagerNavBarComponent,
		ManagerMainBlockComponent,
		PowerPlantBlockComponent,
		ManagerMarketComponent,
		ProsumerCurrencyBlockComponent,
		DialogComponent,
		LogoutComponent,
		UploadProfilePictureComponent,
		ProfilePictureComponent,
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
			allowedDomains: ['localhost:4200']
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
