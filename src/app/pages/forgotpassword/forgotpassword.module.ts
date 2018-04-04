import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { SharedModule } from '../../shared/shared.module';

import { ForgotPasswordComponent } from './forgotpassword.component';
import { routing } from './forgotpassword.routing';


@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    SharedModule
  ],
  declarations: [
    ForgotPasswordComponent
  ]
})
export class ForgotPasswordModule { }