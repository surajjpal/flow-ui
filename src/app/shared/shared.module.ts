import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent, ApiCheckboxComponent } from './shared.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
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
    KeysPipe,
    FileUploaderComponent
  ],
  exports: [
    AlertComponent,
    ApiCheckboxComponent,
    UniversalFilterPipe,
    KeysPipe,
    FileUploaderComponent

  ]
})
export class SharedModule { }
