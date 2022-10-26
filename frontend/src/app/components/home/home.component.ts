import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ProductModelServer} from "../../models/product.model";
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];

  constructor(private productService: ProductService,
              private cartService: CartService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      prods => {
        this.products = prods.products;
      }
    );
  }

  AddProduct(id: number) {
    this.cartService.AddProductToCart(id);
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }
}
