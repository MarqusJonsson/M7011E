import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/containers/login/login.component';
import { LogoutComponent } from './auth/containers/logout/logout.component';
import { AlertComponent } from './alert/containers/alert/alert.component';
import { ProsumerPageComponent } from './users/prosumer/containers/prosumer-page/prosumer-page.component';
import { AccountSettingsComponent } from './users/shared/containers/account-settings/account-settings.component';
import { NavBarComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/nav-bar/nav-bar.component';
import { VisualBlockComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/visual-block/visual-block.component';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphComponent } from './users/shared/containers/graph/graph.component';
import { RatioBlockComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/ratio-block/ratio-block.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './auth/containers/register/register.component';
import { ManagerPageComponent } from './users/manager/containers/manager-page/manager-page.component';
import { ManagerNavBarComponent } from './users/manager/containers/manager-page/manager-page-children/manager-nav-bar/manager-nav-bar.component';
import { ManagerMainBlockComponent } from './users/manager/containers/manager-page/manager-page-children/manager-main-block/manager-main-block.component';
import { PowerPlantBlockComponent } from './users/manager/containers/manager-page/manager-page-children/power-plant-block/power-plant-block.component';
import { SubBlockComponent } from './users/shared/containers/sub-block/sub-block.component';
import { ManagerMarketComponent } from './users/manager/containers/manager-page/manager-page-children/manager-market/manager-market.component';
import { ProsumerCurrencyBlockComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/prosumer-currency-block/prosumer-currency-block.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth/services/auth.service';
import JwtInterceptor from './api/interceptors/jwt.interceptor';
import { GraphQLModule } from './graphql.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './users/shared/containers/dialog/dialog.component';
import { UploadProfilePictureComponent } from './picture/containers/upload-profile-picture/upload-profile-picture.component';
import { ProfilePictureComponent } from './users/shared/containers/profile-picture/profile-picture.component';

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
		SubBlockComponent,
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
			tokenGetter: AuthService.getAccessToken,
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
