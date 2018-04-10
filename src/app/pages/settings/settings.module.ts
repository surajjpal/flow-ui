import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { TagInputModule } from 'ngx-chips';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './settings.routing';

import { SettingsComponent } from './settings.component';
import { UpdateUserComponent } from '../master/components/updateUser/updateUser.component';
import { ChangePasswordComponent } from './components/changepassword.component'

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    NgaModule,
    routing,
    TagInputModule,
    SharedModule
    
  ],
  declarations: [
    SettingsComponent,
    ChangePasswordComponent
    
  ]
})
export class SettingsModule { }
