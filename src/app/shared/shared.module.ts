import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent, ApiCheckboxComponent } from './shared.component';
import { UniversalFilterPipe } from './universal-data-filter.pipe';
import { KeysPipe } from './key-filter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlertComponent,
    ApiCheckboxComponent,
    UniversalFilterPipe,
    KeysPipe
  ],
  exports: [
    AlertComponent,
    ApiCheckboxComponent,
    UniversalFilterPipe,
    KeysPipe

  ]
})
export class SharedModule { }
