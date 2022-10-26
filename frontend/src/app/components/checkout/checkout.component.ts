import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CartModelServer} from "../../models/cart.model";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  cartData: CartModelServer = {
    data: [{
      product: {id: 0, name: '', category: '', description: '', image: '', price: 0, quantity: 0, images: ''},
      numInCart: 0
    }],
    total: 0
  };

  cartTotal: number = 0;
  form = {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  };

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(private cartService: CartService,
              private userService: UserService,
              private spinner: NgxSpinnerService,
              private toast: ToastrService) {
  }

  ngOnInit() {
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  onSubmit(): void {
    this.userService.registration(this.form.firstname, this.form.lastname, this.form.email, this.form.password).subscribe({
      next: (res: any) => {
        this.spinner.show().then(() => {
          this.cartService.CheckoutFromCart(res.id);
        });
      },
      error: (err: any) => {
        err.error.errors.forEach((e: any) => {
          this.toast.error(`${e.msg} #${e.param}`, "Registration Error", {
            timeOut: 4500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        });
      }
    });
  }
}
