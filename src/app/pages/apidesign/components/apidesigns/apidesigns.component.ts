import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';


@Component ({
  selector: 'api-designs',
  templateUrl: './apidesigns.component.html',
  styleUrls: ['./apidesigns.scss']
})
export class ApiDesignsComponent implements OnInit, OnDestroy {
  
  private subscription: Subscription;
  
  constructor(
  
  ) {
    
  }
  
  ngOnInit() {
    
  }
  
  ngOnDestroy(): void {
    
  }

  
}
