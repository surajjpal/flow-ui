declare var closeModal: any;

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/operator/switchMap';

// Model Imports
import { GraphObject } from '../../../../models/flow.model';

// Service Imports
import { GraphService, CommunicationService } from '../../../../services/flow.service';

@Component({
  selector: 'api-flow-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.scss']
})

export class SearchComponent implements OnInit, OnDestroy {

  private readonly ACTIVE = 'ACTIVE';
  private readonly CLOSED = 'CLOSED';
  private readonly DRAFT = 'DRAFT';

  private readonly OPEN_IN_READONLY_MODE = 1;
  private readonly OPEN_IN_EDIT_MODE = 2;
  private readonly CLONE_AND_EDIT_MODE = 3;

  data;
  filterQuery = '';
  rowsOnPage = 10;
  sortBy = 'machineType';
  sortOrder = 'asc';


  // Models to bind with html
  activeGraphObjectList: GraphObject[];
  closedGraphObjectList: GraphObject[];
  dictionaryGraphObjectList: GraphObject[];
  selectedGraphObject: GraphObject = new GraphObject();

  private subscription: Subscription;
  private subscriptionActive: Subscription;
  private subscriptionClosed: Subscription;
  private subscriptionTemplate: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private graphService: GraphService,
    private communicationService: CommunicationService
  ) {

  }

  ngOnInit() {
    this.fetchGraphs();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionActive && !this.subscriptionActive.closed) {
      this.subscriptionActive.unsubscribe();
    }
    if (this.subscriptionClosed && !this.subscriptionClosed.closed) {
      this.subscriptionClosed.unsubscribe();
    }
    if (this.subscriptionTemplate && !this.subscriptionTemplate.closed) {
      this.subscriptionTemplate.unsubscribe();
    }
  }

  fetchGraphs(): void {
    this.subscriptionActive = this.graphService.fetch('ACTIVE')
      .subscribe(graphObjects => this.activeGraphObjectList = graphObjects);
    this.subscriptionActive = this.graphService.fetch('CLOSED')
      .subscribe(graphObjects => this.closedGraphObjectList = graphObjects);
    this.subscriptionActive = this.graphService.fetch('TEMPLATE')
      .subscribe(graphObjects => this.dictionaryGraphObjectList = graphObjects);
  }

  toInt(num: string) {
    return +num;
  }

  sortByWordLength = (a: any) => {
    return a.city.length;
  }

  onSelect(graphObject: GraphObject, task?: number): void {
    this.selectedGraphObject = graphObject;

    if (task) {
      if (task === this.OPEN_IN_READONLY_MODE) {
        this.openInDesigner(this.selectedGraphObject, true);
      } else if (task === this.OPEN_IN_EDIT_MODE) {
        this.openInDesigner(this.selectedGraphObject);
      } else if (task === this.CLONE_AND_EDIT_MODE) {
        this.selectedGraphObject._id = null;
        this.selectedGraphObject.statusCd = this.DRAFT;

        this.openInDesigner(this.selectedGraphObject);
      }
    }
  }

  openInDesigner(graph: GraphObject, readOnly?: boolean) {
    this.communicationService.sendGraphObject(graph, (readOnly !== null && readOnly));
    this.router.navigate(['/pages/flow/design'], { relativeTo: this.route });
  }

  activateFlow(graph: GraphObject, modalName?: string) {
    this.subscription = this.graphService.activate(graph._id)
    .subscribe(response => {
      if (modalName && modalName.length > 0) {
        new closeModal(modalName);
      }
      this.fetchGraphs();
    });
  }

  deactivateFlow(graph: GraphObject) {
    this.subscription = this.graphService.deactivate(graph._id)
    .subscribe(response => {
      this.fetchGraphs();
    });
  }
}
