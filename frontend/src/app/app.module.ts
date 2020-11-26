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

import { PlotlyViaCDNModule } from 'angular-plotly.js';
import { PlotlyComponent } from './users/shared/containers/plotly/plotly.component';
PlotlyViaCDNModule.setPlotlyVersion('1.55.2'); // can be `latest` or any version number (i.e.: '1.40.0')
PlotlyViaCDNModule.setPlotlyBundle('basic'); // optional: can be null (for full) or 'basic', 'cartesian', 'geo', 'gl3d', 'gl2d', 'mapbox' or 'finance'

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
    PlotlyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    PlotlyViaCDNModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
