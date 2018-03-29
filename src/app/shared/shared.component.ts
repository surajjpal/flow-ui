import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from '../services/shared.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'api-alert',
    template: `
      <div *ngIf="message" [innerHTML]="message.text" [ngClass]="{ 'alert': message, 'alert-success': message.type === 'success', 'alert-danger': message.type === 'error' }">
      </div>
    `
})
export class AlertComponent implements OnInit {
    message: any;
 
    constructor(private alertService: AlertService) { }
 
    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }
}


@Component({
    selector: 'api-checkbox',
    template: `
        <div class="checkbox">
            <label class="checkbox-inline custom-checkbox nowrap">
                <input type="checkbox" [disabled]="disabled" [checked]="checked" (change)="onChange($event)">
                <span>
                    {{label}}
                </span>
            </label>
        </div>
    `,
    styleUrls: ['./checkbox.scss']
})
export class ApiCheckboxComponent {
    @Input() disabled: boolean = false;
    @Input() label: string = '';
    @Input() checked: boolean = false;

    @Output()
    event: EventEmitter<any> = new EventEmitter<any>();
 
    constructor() { }
 
    onChange(checked: any) {
        this.event.emit(checked);
    }
}

@Component({
    selector: "api-datepicker",
    template: `
    <form class="form-inline">
        <div class="form-group">
            <div class="input-group">
                <input class="form-control" placeholder="yyyy-mm-dd"
                    [value]="currentDate" (input)="setCurrentDate($event.target.value)" ngbDatepicker #d="ngbDatepicker">
                <div class="input-group-append">
                <button class="btn btn-outline-secondary" (click)="d.toggle()" type="button">
                    <img src="img/calendar-icon.svg" style="width: 1.2rem; height: 1rem; cursor: pointer;"/>
                </button>
                </div>
            </div>
        </div>
    </form>
    
    <hr/>
    `
})
export class NgbdDatepickerPopup {
    currentDate: any;
    @Output() selectedDateChange = new EventEmitter();
    
    setCurrentDate(newDate) {
        this.currentDate = newDate;

        let dateObject = new Date();
        dateObject.setFullYear(this.currentDate.year, (this.currentDate.month - 1), this.currentDate.day);
        this.selectedDateChange.emit(this.currentDate);
    }

    @Input()
    get selectedDate() {
        let dateObject = new Date();
        dateObject.setFullYear(this.currentDate.year, (this.currentDate.month - 1), this.currentDate.day);

        console.log(dateObject);
        return dateObject;
    }

    
    set selectedDate(dateObject: Date) {
        if (!dateObject || dateObject == null) {
            dateObject = new Date();
        }

        if (!this.currentDate || this.currentDate == null) {
            this.currentDate = {};
        }
        this.currentDate.year = dateObject.getFullYear();
        this.currentDate.month = dateObject.getMonth() + 1;
        this.currentDate.day = dateObject.getDate();

        this.selectedDateChange.emit(dateObject);
    }
  }