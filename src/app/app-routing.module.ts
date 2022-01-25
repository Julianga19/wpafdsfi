import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ChartTypedByUserComponent } from './chart-typed-by-user/chart-typed-by-user.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { LimitsComponent } from './limits/limits.component';
import { LoginComponent } from './login/login.component';
import { LoteriesComponent } from './loteries/loteries.component';
import { MainComponent } from './main/main.component';
import { UsersComponent } from './users/users.component';
import { VendorsComponent } from './vendors/vendors.component';
import { WinnerComponent } from './winner/winner.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: 'winner',
    component: WinnerComponent
  },
  {
    path: 'limits',
    component: LimitsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'graphics',
    component: ChartTypedByUserComponent
  }, 
  {
    path: 'users',
    component: UsersComponent
  }, 
  {
    path: 'vendors',
    component: VendorsComponent
  }, 
  {
    path: 'loteries',
    component: LoteriesComponent
  }, 
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
