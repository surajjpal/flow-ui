declare var closeModal: any;
declare var showModal: any;
import { Component, Input, OnInit, OnDestroy,EventEmitter,Output } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/operator/switchMap';

// Model Imports
import { ProcessModel } from '../../../../models/flow.model';

// Service Imports
import { CommunicationService,ProcessService } from '../../../../services/flow.service';
import { StateService, DataCachingService } from '../../../../services/inbox.service';
import { DateRangePickerComponent } from '../dashboard/daterangepicker/daterangepicker.component';

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
  selectedHighLights: any[] = [];
  
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
    if (this.startTime) {
      body["startTime"] = parseFloat(this.startTime);
    }
    else {
      body["startTime"] = this.startTime;
    }
    if (this.endTime) {
      body["endTime"] = parseFloat(this.endTime);
    }
    else {
      body["endTime"] = this.endTime;
    }
    body["textSearch"] = this.filterQuery;
    if(this.filterQuery!=null && this.filterQuery.length > 0){
      this.subscription = this.processService.getAll(body)
      .subscribe(processObjects => {
        if (processObjects.length > 0) {
          this.processList = processObjects;
          this.setHighLights();
          this.submitted = true;
        }
      });
    }
    
  }

  setHighLights() {
    for(let process of this.processList) {
      if(process.parameters && (!process.highlights || process.highlights.length == 0)) {
        for(let key in process.parameters) {
          if (typeof process.parameters[key] == 'string' && process.parameters[key].includes(this.filterQuery)) {
            var match = { key: key, value: process.parameters[key] }
            if (!process.highlights) {
              process.highlights = [];
            }
            process.highlights.push(match);
          }
          else if (typeof process.parameters[key] == "object" &&  process.parameters[key] instanceof Array) {
            this.getMatchParamsFromList(key, process.parameters[key]);
          }
          else if(typeof process.parameters[key] == "object" ){
            this.getMatchParamsFromMap(key, process.parameters[key]);
          }
        }
      }
      
    }
  }

  getMatchParamsFromList(key, paramList: any[]) {
    var matchParams = []
    for (let para of paramList) {
        
      if (typeof para == "string" && para.includes(this.filterQuery)) {
        var match = {key: key, value: para}
        this.selectedHighLights.push(match);
      }
      else if (typeof para == "object" && para instanceof Array) {
        this.getMatchParamsFromList(key, para);
      }
      else if (typeof para == "object") {
        this.getMatchParamsFromMap(key, para);
      }

    }
  }

  getMatchParamsFromMap(key, paraMap: any) {
    for(let nestedKey in paraMap) {
      if (typeof paraMap[nestedKey] == "string" && paraMap[nestedKey].includes(this.filterQuery)) {
        var match = {key: key + "." + nestedKey, value: paraMap[nestedKey]}
        this.selectedHighLights.push(match);
      }
      else if (typeof paraMap[nestedKey] == "object" && paraMap[nestedKey] instanceof Array) {

      }
      else if (typeof paraMap[nestedKey] == "object") {
        
      }
    }
  }

  showHighlights(process: ProcessModel) {
    if (process && process.highlights) {
      this.selectedHighLights = process.highlights;
    }
    else {
    this.selectedHighLights = [];
    }
    showModal("highlightsmodal");
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
