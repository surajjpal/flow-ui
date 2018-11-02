import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Domain, Goal } from '../../../../models/domain.model';
import { DomainService } from '../../../../services/domain.service';
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
  private readonly OPEN_IN_READONLY_MODE = 1;
  private readonly OPEN_IN_EDIT_MODE = 2;
  private readonly CLONE_AND_EDIT_MODE = 3;
  private readonly ACTIVE = 'ACTIVE';
  private readonly CLOSED = 'CLOSED';
  private readonly DRAFT = 'DRAFT';
  private readonly CLONED = 'CLONED';
  private subscription: Subscription;
  
  constructor(
    private domainService: DomainService,
    private router: Router,
    private route: ActivatedRoute,
    private sharingService: DataSharingService
  ) {
    this.domainSource = [];
    this.selectedDomain = new Domain();
  }
  
  ngOnInit() {
    this.fetchActiveDomains();
    this.fetchClosedDomains();
  }
  
  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  filterQuery: string;
  fetchDomains() {
    this.subscription = this.domainService.domainLookup()
      .subscribe(
        domains => {
          if (domains) {
            console.log(domains)
            this.domainSource = domains;
          }
        }
      );
  }

  fetchActiveDomains() {
    let payload = {"statusCd":{ "$in": ["ACTIVE","DRAFT"]}}
    this.subscription = this.domainService.domainLookup(payload)
      .subscribe(
        domains => {
          if (domains) {
            console.log(domains)
            this.domainSource = domains;
          }
        }
      );
  }

  fetchClosedDomains() {
    let payload = {"statusCd":"CLOSED"}
    this.subscription = this.domainService.domainLookup(payload)
      .subscribe(
        domains => {
          if (domains) {
            console.log(domains)
            this.domainSourceClosed = domains;
          }
        }
      );
  }



  // onDomainSelect(domain?: Domain) {
  //   if (domain) {
  //     this.selectedDomain = domain;
  //   } else {
  //     this.selectedDomain = null;
  //   }

  //   this.sharingService.setSharedObject(this.selectedDomain);

  //   this.router.navigate(['/pg/dmn/dms'], { relativeTo: this.route });
  // }

  
  onDomainSelect(domain?: Domain, task?: number): void {
   // this.progressBarFlag = true;
      console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[")
      console.log(domain.statusCd)
      if(domain.statusCd!=null){
        if(domain!=null && domain._id.length > 0)
        {
         // this.progressBarFlag = false;
          this.selectedDomain = domain;
          if (task) {
            if (task === this.OPEN_IN_READONLY_MODE) {
              console.log("===================EDIT MODE====================")
              this.selectedDomain.statusCd = this.DRAFT;
              this.selectedDomain.previousDomainId = this.selectedDomain._id;
              this.selectedDomain._id = null;
              this.sharingService.setSharedObject(this.selectedDomain);
              this.router.navigate(['/pg/dmn/dms'], { relativeTo: this.route });

            } else if (task === this.OPEN_IN_EDIT_MODE) {
              
              this.sharingService.setSharedObject(this.selectedDomain);
              this.router.navigate(['/pg/dmn/dms'], { relativeTo: this.route });
              


            } else if (task === this.CLONE_AND_EDIT_MODE) {
              this.selectedDomain._id = null;
              this.selectedDomain.statusCd = this.CLONED;
              this.sharingService.setSharedObject(this.selectedDomain);
              this.router.navigate(['/pg/dmn/dms'], { relativeTo: this.route });
              
            }
          }
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
