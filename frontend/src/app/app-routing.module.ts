import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/containers/login/login.component';
import { ProsumerPageComponent } from './users/prosumer/containers/prosumer-page/prosumer-page.component';
import { AccountSettingsComponent } from './users/shared/containers/account-settings/account-settings.component';
import { RegisterComponent } from './auth/containers/register/register.component';
import { ManagerPageComponent } from './users/manager/containers/manager-page/manager-page.component';
import { ProsumerGuard } from './auth/guards/prosumer.guard';
import { ManagerGuard } from './auth/guards/manager.guard';
import { DialogComponent } from './users/shared/containers/dialog/dialog.component';

const routes: Routes = [
	{path: '', pathMatch: 'full', redirectTo: '/login'},
	{path: 'login', component: LoginComponent },
	{path: 'register', component: RegisterComponent},
	{path: 'prosumer-page', component: ProsumerPageComponent, canActivate: [ProsumerGuard]},
	{path: 'manager-page', component: ManagerPageComponent, canActivate: [ManagerGuard]},
	{path: 'settings' , component: AccountSettingsComponent},
	{path: '**', redirectTo: '/login'}// Replace with 404 page
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
