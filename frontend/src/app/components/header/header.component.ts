import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {CartModelServer} from "../../models/cart.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authState: boolean = false;
  cartData: CartModelServer = {
    data: [{
      product: {id: 0, name: '', category: '', description: '', image: '', price: 0, quantity: 0, images: ''},
      numInCart: 0
    }],
    total: 0
  };
  cartTotal: number = 0;

  constructor(public cartService: CartService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });

    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);

    this.userService.authState$.subscribe(authState => this.authState = authState);
  }

}
