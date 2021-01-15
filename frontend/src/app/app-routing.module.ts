import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/authentication/login-page/login.component';
import { ProsumerPageComponent } from './components/user/prosumer-page/prosumer-page.component';
import { SettingsPageComponent } from './components/user/settings-page/settings-page.component';
import { RegisterComponent } from './components/authentication/register-page/register.component';
import { ManagerPageComponent } from './components/user/manager-page/manager-page.component';
import { ProsumerPageGuard } from './guards/prosumer-page.guard';
import { ManagerPageGuard } from './guards/manager-page.guard';
import { MainPageGuard } from './guards/main-page.guard';
import { SettingsPageGuard } from './guards/settings-page.guard';

const routes: Routes = [
	{path: '', pathMatch: 'full', children: [], canActivate: [MainPageGuard]},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegisterComponent},
	{path: 'prosumer', component: ProsumerPageComponent, canActivate: [ProsumerPageGuard]},
	{path: 'manager', component: ManagerPageComponent, canActivate: [ManagerPageGuard]},
	{path: 'settings' , component: SettingsPageComponent, canActivate: [SettingsPageGuard]},
	{path: '**', redirectTo: '/login'}// Replace with 404 page
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
