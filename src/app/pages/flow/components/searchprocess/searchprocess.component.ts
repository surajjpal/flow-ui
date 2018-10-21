declare var closeModal: any;

import { Component, Input, OnInit, OnDestroy,EventEmitter,Output } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/operator/switchMap';

// Model Imports
import { ProcessModel } from '../../../../models/flow.model';

// Service Imports
import { CommunicationService,ProcessService } from '../../../../services/flow.service';
import { StateService, DataCachingService } from '../../../../services/inbox.service';
import { DateRangePickerComponentSearch } from './daterangepicker/daterangepickersearch.component'

@Component({
  selector: 'api-flow-searchprocess',
  templateUrl: './searchprocess.component.html',
  styleUrls: ['./searchprocess.scss'],
  providers: [ProcessService]
})

export class SearchProcessComponent implements OnInit, OnDestroy {

  private readonly ACTIVE = 'ACTIVE';
  private readonly CLOSED = 'CLOSED';
  private readonly DRAFT = 'DRAFT';

  

  data;
  filterQuery = '';
  rowsOnPage = 10;
  sortBy = 'machineType';
  sortOrder = 'asc';
 

  @Output()
  selectedData: EventEmitter<any> = new EventEmitter<any>();

  // Models to bind with html
  processList: ProcessModel[];
  
  progressBarFlag: boolean = false;
  submitted:boolean = false;
  startTime:any;
  endTime:any;
  private subscription: Subscription;
  private subscriptionXML:Subscription;
  private selectedProcess:ProcessModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private processService: ProcessService,
    private communicationService: CommunicationService,
    private stateService: StateService,
    private dataCachingService: DataCachingService
  ) {

  }

  ngOnInit() {
    this.fetchProcesses();
  }

  onDateRangeSelect(dateRange: any) {
    
    this.startTime = dateRange.start.format('x');
    this.endTime = dateRange.end.format('x');
    
  }


  onSubmit(){
    let body = {};
    //body["companyContext"] = {"companyId":"e95764c923e74e308d0019516b17cabd"};
    //body["startTime"] = 1539386552250;
    body["startTime"] = this.startTime;
    body["endTime"] = this.endTime;
    body["searchText"] = this.filterQuery;
    if(this.filterQuery!=null && this.filterQuery.length > 0){
      this.subscription = this.processService.getAll(body)
      .subscribe(processObjects => {
        if (processObjects.length > 0) {
          this.processList = processObjects;
          this.submitted = true;
        }
      });
    }
    
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
   
  }

  fetchProcesses(): void {
  }

  toInt(num: string) {
    return +num;
  }

  sortByWordLength = (a: any) => {
    return a.city.length;
  }

  onSelect(selectedData: any): void {
    this.selectedData.emit(selectedData);
    this.selectedProcess = selectedData;
    this.progressBarFlag = true;
    this.subscriptionXML = this.stateService.getXMLforActiveState(selectedData.flowId)
      .subscribe(graphObject => {
        this.progressBarFlag = false
        this.dataCachingService.setSharedObject(graphObject, this.selectedProcess);
        this.router.navigate(['/pg/flw/flpa'], { relativeTo: this.route });
      });
  }

  
}
