import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { AlertService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'api-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnDestroy {

  form: FormGroup;
  name: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  repeatPassword: AbstractControl;
  passwords: FormGroup;

  submitted: boolean = false;

  newUser: User = new User();
  loading = false;

  private userSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {

    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
    });

    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);

      if (values['passwords'] && (values['passwords'])['password'] && (values['passwords'])['repeatPassword']
        && ((values['passwords'])['password'] === (values['passwords'])['password'])) {

        this.loading = true;

        this.newUser.name = values['name'];
        this.newUser.username = values['email'];
        this.newUser.email = values['email'];
        this.newUser.password = (values['passwords'])['password'];
        this.newUser._id = null;

        this.userSubscription = this.authService.register(this.newUser)
          .subscribe(
          data => {
            // set success message and pass true paramater to persist the message after redirecting to the login page
            this.alertService.success('Registration successful', true);
            this.router.navigate(['/login']);
          },
          error => {
            this.loading = false;
          });
      }
    }
  }

  ngOnDestroy() {
    if (this.userSubscription && !this.userSubscription.closed) {
      this.userSubscription.unsubscribe();
    }
  }
}
