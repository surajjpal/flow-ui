declare var closeModal: any;

import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Model Imports
import { GraphObject } from '../../flow.model';

// Service Imports
import { GraphService, CommunicationService } from '../../flow.service';


@Component({
  selector: 'api-flow-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.scss']
})

export class SearchComponent implements OnInit {

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

  fetchGraphs(): void {
    this.graphService.fetch('ACTIVE')
      .then(graphObjects => this.activeGraphObjectList = graphObjects);
      this.graphService.fetch('CLOSED')
      .then(graphObjects => this.closedGraphObjectList = graphObjects);
      this.graphService.fetch('TEMPLATE')
      .then(graphObjects => this.dictionaryGraphObjectList = graphObjects);
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
    this.graphService.activate(graph._id)
    .then(
      response => {
        if (modalName && modalName.length > 0) {
          new closeModal(modalName);
        }
        this.fetchGraphs();
      },
      error => {

      }
    );
  }

  deactivateFlow(graph: GraphObject) {
    this.graphService.deactivate(graph._id)
    .then(
      response => {
        this.fetchGraphs();
      },
      error => {

      }
    );
  }
}
