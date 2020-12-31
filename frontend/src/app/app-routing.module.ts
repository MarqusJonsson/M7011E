import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { ProsumerPageComponent } from './components/user/prosumer-page/prosumer-page.component';
import { AccountSettingsComponent } from './components/user/shared/account-settings/account-settings.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { ManagerPageComponent } from './components/user/manager-page/manager-page.component';
import { ProsumerGuard } from './guards/prosumer.guard';
import { ManagerGuard } from './guards/manager.guard';
import { MainPageGuard } from './guards/main-page.guard';

const routes: Routes = [
	{path: '', pathMatch: 'full', children: [], canActivate: [MainPageGuard]},
	{path: 'login', component: LoginComponent},
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
