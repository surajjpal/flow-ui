import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService, AlertService, UniversalUser } from '../../shared/shared.service';
import { User } from '../../models/user.model';

import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'api-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  user: User = new User();
  loading = false;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private httpClient: HttpClient,
    private universalUser: UniversalUser
  ) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);

      if (values.hasOwnProperty('email') && values.hasOwnProperty('password')) {
        this.user.username = values['email'];
        this.user.password = values['password'];

        this.login();
      }
    }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    const url = `${environment.server + environment.authurl}`;
    // const options = new RequestOptions({ headers: this.headers });

    this.httpClient.post<User>(
      url,
      this.user,
      { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        observe: 'response',
        reportProgress: true
      })
      .subscribe(
        (response: HttpResponse<User>) => {
          if (response.body) {
            this.onSuccessfulLogin(response.body);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            console.log(err);
            console.log('Assuming error code 302 and redirecting');
            // this.afterLoginRedirection();
          }
        }
      );
  }

  afterLoginRedirection() {
    const url = `${environment.server}`;

    this.httpClient.get<User>(
      url,
      { 
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      })
      .subscribe(
        (response: HttpResponse<User>) => {
          console.log(response);
          if (response.body) {
            this.onSuccessfulLogin(response.body);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
            this.alertService.error(`Failed to authenticate. Reason: ${err.error}`, false, 5000);
          }
        }
      );
  }

  onSuccessfulLogin(user: User) {
    if (user) {
      this.universalUser.setUser(user);
      this.router.navigate([this.returnUrl]);
    }
  }
    // this.authService.authenticate(this.user)
    //   .then(
    //     data => {
    //       this.authService.getUser().subscribe (data=>this.router.navigate([this.returnUrl]))

    //     },
    //     error => {
    //       this.alertService.error(error);
    //       this.loading = false;
    //     }
    // );
  // }
}
