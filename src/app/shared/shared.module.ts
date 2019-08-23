import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertComponent, ApiCheckboxComponent, NgbdDatepickerPopup } from './shared.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { VerticalTimelineComponent } from './components/vertical-timeline/vertical-timeline.component'
import { APISpinnerComponent } from './components/api-spinner/api-spinner.component';
import { UniversalFilterPipe } from './universal-data-filter.pipe';
import { KeysPipe } from './key-filter.pipe';
import { MomentModule } from 'angular2-moment';


@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MomentModule
  ],
  declarations: [
    AlertComponent,
    ApiCheckboxComponent,
    UniversalFilterPipe,
    KeysPipe,
    NgbdDatepickerPopup,
    FileUploaderComponent,
    APISpinnerComponent,
    VerticalTimelineComponent
  ],
  exports: [
    AlertComponent,
    ApiCheckboxComponent,
    UniversalFilterPipe,
    KeysPipe,
    NgbdDatepickerPopup,
    FileUploaderComponent,
    APISpinnerComponent,
    VerticalTimelineComponent
  ]
})
export class SharedModule { }
