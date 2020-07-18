import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductComponent } from '../app/product/product.component';
import { OrderComponent } from '../app/order/order.component';

export const appRoutes: Routes = [
    { path:'', redirectTo:'/product', pathMatch:'full'},
    { path:'product', component:ProductComponent},
    { path:'order', component:OrderComponent},
]

@NgModule({
    imports:[RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]
})

export class AppRoutingModule {}
