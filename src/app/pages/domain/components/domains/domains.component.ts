declare var closeModal: any;
declare var openModal : any;
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Domain, Goal } from '../../../../models/domain.model';
import { Agent } from '../../../../models/agent.model';
import { DomainService } from '../../../../services/domain.service';
import { AgentService } from '../../../../services/agent.service';
import { DataSharingService } from '../../../../services/shared.service';

@Component ({
  selector: 'api-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.scss']
})
export class DomainsComponent implements OnInit, OnDestroy {
  domainSource: Domain[];
  domainSourceClosed: Domain[];
  selectedDomain: Domain;
  activeDomain:Domain;
  associatedAgents:Agent[];
  private readonly OPEN_IN_READONLY_MODE = 1;
  private readonly OPEN_IN_EDIT_MODE = 2;
  private readonly CLONE_AND_EDIT_MODE = 3;
  private readonly ACTIVE = 'ACTIVE';
  private readonly CLOSED = 'CLOSED';
  private readonly DRAFT = 'DRAFT';
  private readonly READ = "READ";
  private readonly CLONED = 'CLONED';
  domainPageNo: number;
  domainPageSize : number;
  moreDomainPages: boolean;
  moreClosedDomainPages:boolean;
  closedDomainPageNo:number;

  fields : String[];

  private subscription: Subscription;
  private domainSubscription: Subscription;
  private agentSubscription: Subscription;
  
  constructor(
    private domainService: DomainService,
    private agentService:AgentService,
    private router: Router,
    private route: ActivatedRoute,
    private sharingService: DataSharingService
  ) {
    this.domainSource = [];
    this.domainSourceClosed =[];
    this.selectedDomain = new Domain();
    this.activeDomain = new Domain();
    this.associatedAgents = [];
  }
  
  ngOnInit() {
    
    this.domainPageNo = 0;
    this.domainPageSize = 5;
    this.closedDomainPageNo = 0;
    this.fields = [];
    this.fields.push("_id");
    this.fields.push("name");
    this.fields.push("version");
    this.fields.push("langSupported");
    this.fields.push("statusCd");

    this.fetchActiveDomains();
    this.fetchClosedDomains();
  }
 
  
  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if(this.domainSubscription && !this.domainSubscription.closed) {
      this.domainSubscription.unsubscribe();
      
    }
  }

  filterQuery: string;

  fetchActiveDomains() {
    let payload = { "$or": [ {"statusCd":{ "$in": ["ACTIVE","DRAFT","CLONED"]}}, { "statusCd": { "$exists": false } } ] } 
    this.subscription = this.domainService.domainLookup(payload,this.domainPageNo, this.domainPageSize,this.fields)
      .subscribe(
        domains => {
          if (domains)  {
            if(domains.length < this.domainPageSize) {
              this.moreDomainPages = false;
            }
            else {
              this.moreDomainPages = true;
              this.domainPageNo += 1;
            }
            
            this.domainSource = this.domainSource.concat(domains);
          }
        }
      );
  }

  fetchClosedDomains() {
    let payload = {"statusCd":"CLOSED"}
    this.subscription = this.domainService.domainLookup(payload,this.closedDomainPageNo, this.domainPageSize,this.fields)
      .subscribe(
        domains => {
          if (domains) {
            if(domains.length < this.domainPageSize) {
              this.moreClosedDomainPages = false;
            }
            else {
              this.moreClosedDomainPages = true;
              this.closedDomainPageNo += 1;
            }
            
            this.domainSourceClosed = this.domainSourceClosed.concat(domains);
            console.log(this.domainSourceClosed);
          }
        }
      );
  }



  
  onDomainSelect(domain?: Domain, task?: number): void {
      if(domain && domain["statusCd"]){
        if(domain!=null && domain._id.length > 0)
        {
         let payload = {"_id":domain._id}
         this.subscription = this.domainService.getDomain(payload)
         .subscribe(
           response => {
             if(response){
              this.selectedDomain = response;
              if (task) {
                if (task === this.OPEN_IN_READONLY_MODE) {
                  this.selectedDomain.statusCd = this.READ;
                  this.sharingService.setSharedObject(this.selectedDomain);
                  this.router.navigate(['/pg/dmn/dms'], { relativeTo: this.route });
    
                } 
                else if (task === this.OPEN_IN_EDIT_MODE) {
                  this.sharingService.setSharedObject(this.selectedDomain);
                  this.router.navigate(['/pg/dmn/dms'], { relativeTo: this.route });
                } 
                else if (task === this.CLONE_AND_EDIT_MODE) {
                  console.log(this.selectedDomain["statusCd"]);
                  this.selectedDomain._id = null;
                  if (this.selectedDomain.statusCd && this.selectedDomain.statusCd != this.CLOSED)
                  {
                    this.selectedDomain.statusCd = this.DRAFT;
                  }
                  this.sharingService.setSharedObject(this.selectedDomain);
                  this.router.navigate(['/pg/dmn/dms'], { relativeTo: this.route });
                }
              }
             }
           });
        }
        else{
          this.selectedDomain = null;
        }
      }
      else{
        if (domain) {
          this.selectedDomain = domain;
        } else {
          this.selectedDomain = null;
        }
        this.sharingService.setSharedObject(this.selectedDomain);
        this.router.navigate(['/pg/dmn/dms'], { relativeTo: this.route });
      }
    
  }

  activateDomaiWarning(domain?:Domain){
    this.selectedDomain = domain;
  }



  activateDomain(domain?: Domain,modalName?:string){
    let payload = {"name":domain.name,"statusCd":"ACTIVE"};
    this.subscription = this.domainService.getDomain(payload)
    .subscribe(
      response => {
        console.log(response)
        if(response["statusCd"] == this.ACTIVE){
          this.activeDomain = response;
          this.activeDomain.statusCd = "CLOSED";
          this.getAgentWithDomain(response["_id"]);
          this.subscription = this.domainService.saveDomain(this.activeDomain)
          .subscribe(
            response => {
              if(response){
                domain.statusCd = "ACTIVE";
                this.saveDomain(domain,modalName);
              }
            });
        }
        else{
          domain.statusCd = "ACTIVE";
          this.saveDomain(domain,modalName);
        }
      });
    }
      
    getAgentWithDomain(domainId?:string){
      let payload ={ "$and": [{"domainId":domainId},{"companyTestingAgent":{"$exists":false}}]};
      this.agentSubscription = this.agentService.getDomainAgents(payload).subscribe(receivedAgents=> {
      if(receivedAgents.length > 0 ){
        for(let a of receivedAgents){
          this.associatedAgents.push(a);
        }
      }
    });
    }


    saveAgentWithActiveDomain(agent?:Agent){
      this.agentSubscription = this.agentService.saveAgent(agent).subscribe(receivedAgent=> {
        if(receivedAgent) {
         console.log(receivedAgent);
        }
      });
    }
    


    saveDomain(domain?: Domain,modalName?:string){
      this.subscription = this.domainService.saveDomain(domain)
        .subscribe(
          response => {
            if (modalName && modalName.length > 0) {
              new closeModal(modalName);
          }
            this.domainPageNo = 0;
            this.domainPageSize = 5;
            this.closedDomainPageNo = 0;
            this.selectedDomain = response;
            if (this.selectedDomain.statusCd == this.ACTIVE && this.associatedAgents.length > 0){
              for(let agent of this.associatedAgents){
                agent.domainId = this.selectedDomain._id;
                this.saveAgentWithActiveDomain(agent);
              }
              
            }
            this.domainSource = [];
            this.domainSourceClosed = [];
            this.fetchActiveDomains();
            this.fetchClosedDomains();
             
          },
          error => {
            
          }
        );
    }


    deactivateDomain(domain){
      domain.statusCd = "CLOSED"
      this.subscription = this.domainService.saveDomain(domain)
        .subscribe(
          response => {
            this.selectedDomain = response;
            this.domainSource = [];
            this.domainSourceClosed = [];
            this.fetchActiveDomains();
            this.fetchClosedDomains();
          },
          error => {
            
          }
        )
    }

  domainGoalsToString(goals: Goal[]) {
    let goalString: string = 'none';

    if (goals) {
      for (let i = 0, len = goals.length; i < len; i++) {
        if (i === 0) {
          goalString = '';
        }

        if (goals[i] && goals[i].goalName && goals[i].goalName.length > 0) {
          goalString += goals[i].goalName;
        }

        if (i < (len - 1)) {
          goalString += ', ';
        }
      }
    }

    return goalString;
  }

  arrayToString(array: String[]) {
    let arrayString: string = 'none';

    if (array) {
      for (let i = 0, len = array.length; i < len; i++) {
        if (i === 0) {
          arrayString = '';
        }

        if (array[i] && array[i].length > 0) {
          arrayString += array[i];
        }

        if (i < (len - 1)) {
          arrayString += ', ';
        }
      }
    }

    return arrayString;
  }
}
