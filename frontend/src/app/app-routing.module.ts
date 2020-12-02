import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './users/shared/containers/login/login.component';
import { ProsumerPageComponent } from './users/prosumer/containers/prosumer-page/prosumer-page.component';
import { AccountSettingsComponent } from './users/shared/containers/account-settings/account-settings.component';
import { RegistrationComponent } from './users/shared/containers/registration/registration.component';
import { ManagerPageComponent } from './users/manager/containers/manager-page/manager-page.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path:  'login', component: LoginComponent },
  {path: 'registration', component: RegistrationComponent},
  {path:  'prosumerPage', component: ProsumerPageComponent },
  {path: 'settings' , component: AccountSettingsComponent},
  {path: 'managerPage', component: ManagerPageComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
