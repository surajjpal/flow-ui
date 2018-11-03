import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploaderService } from '../../services/file-uploader.service'

@Component({
  selector: 'api-spinner',
  templateUrl: `./api-spinner.component.html`,
  styleUrls: ['./api-spinner.scss']
})
export class APISpinnerComponent implements OnInit {

    @Input()
    progressBarFlag: boolean = false;

    constructor() {

    }

    ngOnInit() {

    }
}