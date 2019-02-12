import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AlertService, UniversalUser } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Subscription } from 'rxjs/Subscription';
import { commonKeys } from 'app/models/constants';

@Component({
  selector: 'api-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  user: User = new User();
  loading = false;
  returnUrl: string;

  private userSubscription: Subscription;
  private crudSubscription:Subscription;

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
      'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      if (values.hasOwnProperty('email') && values.hasOwnProperty('password')) {
        this.user.username = values['email'];
        this.user.password = values['password'];

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
    this.userSubscription = this.authService.authenticate(this.user)
      .subscribe(
        user => {
          this.loading = false;
          this.user = user;
          this.universalUser.setUser(user, true);
          this.setCompanyAgent(this.user.companyId);
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
        }
      );
  }

  setCompanyAgent(companyId){

    this.crudSubscription = this.authService.getCompanyAgent(companyId).subscribe(
      company =>{
        if(company){
        console.log("company")
        console.log(company)
        this.universalUser.setAgentId(company["companyAgentId"]);
        }
      },
      error =>{

      }

    );
  }
}
