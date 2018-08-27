import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AlertComponent, ApiCheckboxComponent, NgbdDatepickerPopup } from './shared.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { UniversalFilterPipe } from './universal-data-filter.pipe';
import { KeysPipe } from './key-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AlertComponent,
    ApiCheckboxComponent,
    UniversalFilterPipe,
    KeysPipe,
    NgbdDatepickerPopup,
    FileUploaderComponent
  ],
  exports: [
    AlertComponent,
    ApiCheckboxComponent,
    UniversalFilterPipe,
    KeysPipe,
    NgbdDatepickerPopup,
    FileUploaderComponent

  ]
})
export class SharedModule { }
