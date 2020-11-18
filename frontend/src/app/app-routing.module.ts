import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/containers/login/login.component';
import { ProsumerPageComponent } from './user_pages/prosumer/containers/prosumer-page/prosumer-page.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path:  'login', component: LoginComponent },
  {path:  'prosumerPage', component: ProsumerPageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
