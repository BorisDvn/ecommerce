import {Component, OnInit} from '@angular/core';
import {CartModelServer} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartData: CartModelServer = {
    data: [{
      product: {id: 0, name: '', category: '', description: '', image: '', price: 0, quantity: 0, images: ''},
      numInCart: 0
    }],
    total: 0
  };

  cartTotal: number = 0;

  constructor(public cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  ChangeQuantity(id: number, increaseQuantity: boolean) {
    this.cartService.UpdateCartData(id, increaseQuantity);
  }
}
