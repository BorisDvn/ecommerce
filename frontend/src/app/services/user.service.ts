import {Injectable} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth: boolean = false;
  private server: string = environment.SERVERURL;
  authState$ = new BehaviorSubject<boolean>(this.auth);
  userData$ = new BehaviorSubject<SocialUser>(new SocialUser());

  constructor(private authService: SocialAuthService,
              private httpClient: HttpClient) {

    authService.authState.subscribe((user) => {
      if (user !== null) {
        this.auth = true;
        this.authState$.next(this.auth);
        this.userData$.next(user);
      }
    });
  }

  // Login email and password
  loginUser(email: string, password: string) {
    this.httpClient.post(`${this.server}auth/login`, {email: email, password: password})
      .subscribe((data: any) => {
        this.auth = data.auth;
        this.authState$.next(this.auth);
        this.userData$.next(data);
      });
  }

  // Google
  googleLogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // logout
  logout() {
    this.authService.signOut();
    this.auth = false;
    this.authState$.next(this.auth);
  }

  // Login email and password
  registration(lastname: string, firstname: string, email: string, password: string) {
    return this.httpClient.post(`${this.server}auth/register`, {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password
    });
  }

}


