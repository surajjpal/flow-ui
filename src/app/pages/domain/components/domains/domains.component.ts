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
  selectedDomain: Domain;

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
    this.fetchDomains();
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
            this.domainSource = domains;
          }
        }
      );
  }

  onDomainSelect(domain?: Domain) {
    if (domain) {
      this.selectedDomain = domain;
    } else {
      this.selectedDomain = null;
    }

    this.sharingService.setSharedObject(this.selectedDomain);

    this.router.navigate(['/pages/domain/domainSetup'], { relativeTo: this.route });
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
