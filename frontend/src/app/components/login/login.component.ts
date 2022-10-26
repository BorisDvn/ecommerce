import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string | undefined;
  password: string| undefined;

  constructor(private router: Router,
              private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => {
      if (authState) {
        this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile').then();
      } else {
        this.router.navigateByUrl('/login').then();
      }
    });
  }

  signInWithGoogle() {
    this.userService.googleLogin();
  }

  login(form: NgForm) {
    const email = this.email as string;
    const password = this.password as string;

    if (form.invalid) {
      return;
    }

    form.reset();
    this.userService.loginUser(email, password);
  }
}
