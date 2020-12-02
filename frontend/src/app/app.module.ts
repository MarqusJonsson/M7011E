import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './users/shared/containers/login//login.component';
import { AlertComponent } from './alert/containers/alert/alert.component';
import { ProsumerPageComponent } from './users/prosumer/containers/prosumer-page/prosumer-page.component';
import { AccountSettingsComponent } from './users/shared/containers/account-settings/account-settings.component';
import { NavBarComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/nav-bar/nav-bar.component';
import { VisualBlockComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/visual-block/visual-block.component';
import { PageBlockComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/page-block/page-block.component';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlotlyViaCDNModule } from 'angular-plotly.js';
import { PlotlyComponent } from './users/shared/containers/plotly/plotly.component';
import { RatioBlockComponent } from './users/prosumer/containers/prosumer-page/prosumer-page-children/ratio-block/ratio-block.component';
PlotlyViaCDNModule.setPlotlyVersion('latest'); // can be `latest` or any version number (i.e.: '1.40.0')
PlotlyViaCDNModule.setPlotlyBundle('basic'); // optional: can be null (for full) or 'basic', 'cartesian', 'geo', 'gl3d', 'gl2d', 'mapbox' or 'finance'
import { HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './users/shared/containers/registration/registration.component';
import { ManagerPageComponent } from './users/manager/containers/manager-page/manager-page.component';
import { ManagerNavBarComponent } from './users/manager/containers/manager-page/manager-page-children/manager-nav-bar/manager-nav-bar.component';
import { ManagerMainBlockComponent } from './users/manager/containers/manager-page/manager-page-children/manager-main-block/manager-main-block.component';
import { PowerPlantBlockComponent } from './users/manager/containers/manager-page/manager-page-children/power-plant-block/power-plant-block.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    ProsumerPageComponent,
    AccountSettingsComponent,
    NavBarComponent,
    VisualBlockComponent,
    PageBlockComponent,
    PlotlyComponent,
    RatioBlockComponent,
    RegistrationComponent,
    ManagerPageComponent,
    ManagerNavBarComponent,
    ManagerMainBlockComponent,
    PowerPlantBlockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    PlotlyViaCDNModule,
    BrowserAnimationsModule,
    MatSliderModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
