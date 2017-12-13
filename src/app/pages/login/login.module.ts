import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { SharedModule } from '../../shared/shared.module';

import { LoginComponent } from './login.component';
import { routing } from './login.routing';


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
    LoginComponent
  ]
})
export class LoginModule { }
