import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from '../services/shared.service';
 
@Component({
    selector: 'api-alert',
    template: `
      <div *ngIf="message" [ngClass]="{ 'alert': message, 'alert-success': message.type === 'success', 'alert-danger': message.type === 'error' }">
        {{message.text}}
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