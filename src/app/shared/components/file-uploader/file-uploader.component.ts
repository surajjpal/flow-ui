import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploaderService } from '../../services/file-uploader.service'

@Component({
  selector: 'api-file-uploader',
  template: `<input type="file" [multiple]="multiple" (change)="onFileChange($event)" #fileInput>`,
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  form: FormGroup;
  loading = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  @Input()
  fileUploadUrl = '';

  @Input()
  multiple = false;

  @Output()
  uploadEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    // this.createForm();
  }

  ngOnInit() {
    console.log('File Upload URL: ' + this.fileUploadUrl);
  }

  onFileChange(event) {
    console.log("onFileChange");
    console.log(event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      for (const file of event.target.files) {
        console.log("file");
        //console.log(file);
        const fd = new FormData();
        fd.append('file', file);
        //input.append('type', 'PAYSLIP');
        console.log("input");
        //console.log(fd);
        this.uploadEvent.emit(fd);
        //this.fileUploaderService.upload(fd, this.fileUploadUrl);
        // .subscribe(
        //   response => {
        //     if (response) {
        //       console.log(response);
        //       this.uploadStatus.emit(true);
        //     } else {
        //       this.uploadStatus.emit(false);
        //     }
        //   }, error => {
        //     console.log(error);
        //     this.uploadStatus.emit(false);
        //   }
        // );
      }
    }
  }

  onSubmit() {
    const formModel = this.form.value;
    this.loading = true;
    // In a real-world app you'd have a http request / service call here like
    // this.http.post('apiUrl', formModel)
    setTimeout(() => {
      console.log(formModel);
      alert('done!');
      this.loading = false;
    }, 1000);
  }
}
