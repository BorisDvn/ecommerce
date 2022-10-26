import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {AuthResponseModel} from "../../models/user.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  myUser: AuthResponseModel | SocialUser = new SocialUser();


  constructor(private authService: SocialAuthService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    // to get the stocked logged-in user information
    this.userService.userData$.subscribe((data: SocialUser | AuthResponseModel) => {
        this.myUser = data;
      }
    );

    // to get the current logged-in user information
    this.authService.authState.subscribe((user) => {
      if (user !== null) {
        this.myUser = user;
      } else {
        return;
      }
    });

  }

}
