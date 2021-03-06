import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { WinnerComponent } from './winner/winner.component';
import { LimitsComponent } from './limits/limits.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartTypedByUserComponent } from './chart-typed-by-user/chart-typed-by-user.component';
import { ChartsModule } from 'ng2-charts';
import { UsersComponent } from './users/users.component';
import { VendorsComponent } from './vendors/vendors.component';
import { LoteriesComponent } from './loteries/loteries.component';
import { SalesByVendorComponent } from './sales-by-vendor/sales-by-vendor.component';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ForbiddenComponent,
    WinnerComponent,
    LimitsComponent,
    LoginComponent  ,
    ChartTypedByUserComponent,
    UsersComponent,
    VendorsComponent,
    LoteriesComponent,
    SalesByVendorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
