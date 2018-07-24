import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare let moment: any;

@Component({
  selector: 'api-daterangepicker',
  templateUrl: './daterangepicker.component.html'
})
export class DateRangePickerComponent implements OnInit {

  rangePickerOptions: any = {};

  @Input()
  dateRange: any = {};

  @Output()
  selectedRange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.rangePickerOptions = {
      locale: { format: 'DD-MM-YYYY' },
      alwaysShowCalendars: false,
      showCustomRangeLabel: true,
      timePicker: true,
      timePicker24Hour: true,
      startDate: this.dateRange.start,
      endDate: this.dateRange.end,
      autoApply: true,
      ranges: {
        'Today': [moment().startOf('day'), moment().endOf('day')],
        'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
        'This Week': [moment().startOf('week'), moment().endOf('week')],
        'Last Week': [moment().subtract(1, 'weeks').startOf('week'), moment().subtract(1, 'weeks').endOf('week')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
        'Last 3 Months': [moment().subtract(2, 'months').startOf('month'), moment().endOf('month')],
        'Last 6 Months': [moment().subtract(5, 'months').startOf('month'), moment().endOf('month')],
        'This Year': [moment().startOf('year'), moment().endOf('year')]
      }
    };
    
    //this.dateRange.start = moment().startOf('day');
    //this.dateRange.end = moment().endOf('day');

    this.selectedRange.emit(this.dateRange);
  }

  onRangeSelect(value: any) {
    this.dateRange.start = value.start;
    this.dateRange.end = value.end;
    this.dateRange.label = value.label;

    this.selectedRange.emit(this.dateRange);
  }
}
