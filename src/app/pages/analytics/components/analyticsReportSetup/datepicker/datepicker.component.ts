import { Component, OnInit, Output, EventEmitter } from '@angular/core';

declare let moment: any;

@Component({
  selector: 'api-datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatePickerComponent {
  model;
}