import { Component, OnInit } from '@angular/core';
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
