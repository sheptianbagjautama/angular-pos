import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginInterceptorService } from './login/login-interceptor.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { AppRoutingModule } from '../app/app-routing.module';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { LogoLoginComponent } from './logo-login/logo-login.component';
import { AuthComponent } from './auth/auth.component';
import { LoginService } from './login/login.service';
import { ProductItemComponent } from './product/product-item/product-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductComponent,
    OrderComponent,
    HeaderComponent,
    RegisterComponent,
    LogoLoginComponent,
    AuthComponent,
    ProductItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    LoginService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:LoginInterceptorService,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
