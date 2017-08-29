import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';

import { MasterComponent } from './master.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule
  ],
  declarations: [
    MasterComponent
  ],
  providers: [
   
  ]
})
export class MasterModule { }
