import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './shared.component';
import { UniversalFilterPipe } from './universal-data-filter.pipe';
import { KeysPipe } from './key-filter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlertComponent,
    UniversalFilterPipe,
    KeysPipe
  ],
  exports: [
    AlertComponent,
    UniversalFilterPipe,
    KeysPipe
  ]
})
export class SharedModule { }
