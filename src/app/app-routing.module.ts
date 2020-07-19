import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductComponent } from '../app/product/product.component';
import { OrderComponent } from '../app/order/order.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/login.guard';

export const appRoutes: Routes = [
    { path:'', redirectTo:'/product', pathMatch:'full'},
    { path:'product', component:ProductComponent, canActivate:[LoginGuard]},
    { path:'order', component:OrderComponent, canActivate:[LoginGuard]},
    { path:'login', component:LoginComponent},
]

@NgModule({
    imports:[RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]
})

export class AppRoutingModule {}
