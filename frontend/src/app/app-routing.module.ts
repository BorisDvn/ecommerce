import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ProductComponent} from "./components/product/product.component";
import {CartComponent} from "./components/cart/cart.component";
import {ThankyouComponent} from "./components/thankyou/thankyou.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {LoginComponent} from "./components/login/login.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProfileGuard} from "./components/guard/profile.guard";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'ECOMMERCE'
  },
  {
    path: 'products/:id',
    component: ProductComponent,
    title: 'ECOMMERCE-Product'
  },
  {
    path: 'cart',
    component: CartComponent,
    title: 'ECOMMERCE-Cart'
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    title: 'ECOMMERCE-Checkout'
  },
  {
    path: 'thankyou',
    component: ThankyouComponent,
    title: 'ECOMMERCE-thankyou'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'ECOMMERCE-login'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'ECOMMERCE-profile',
    canActivate: [ProfileGuard] // like middleware
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
