import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AlertService, UniversalUser } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Subscription } from 'rxjs/Subscription';
import { commonKeys } from '../../../app/models/constants';

@Component({
  selector: 'api-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  user: User = new User();
  loading = false;
  returnUrl: string;

  private userSubscription: Subscription;

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
    });

    this.email = this.form.controls['email'];
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      if (values.hasOwnProperty('email')) {
        this.user.username = values['email'];

        this.login();
      }
    }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams[commonKeys.returnUrl] || '/';
  }

  ngOnDestroy() {
    if (this.userSubscription && !this.userSubscription.closed) {
      this.userSubscription.unsubscribe();
    }
  }
  
  login() {
    this.loading = true;
    this.userSubscription = this.authService.forgotPassword(this.user)
      .subscribe(
        user => {
            this.loading = false;
            this.router.navigate([this.returnUrl]);
            this.alertService.success('New password has been mailed to your registerd email id ', true, 10000);
        },
        error => {
          this.loading = false;
          this.alertService.error(error, true, 10000);
        }
      );
  }
}
