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

  data;
  filterQuery = '';
  rowsOnPage = 10;
  sortBy = 'machineType';
  sortOrder = 'asc';


  // Models to bind with html
  graphObjectList: GraphObject[];
  selectedGraphObject: GraphObject = new GraphObject();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private graphService: GraphService,
    private communicationService: CommunicationService
  ) {

  }

  onSelect(graphObject: GraphObject): void {
    this.selectedGraphObject = graphObject;
    this.communicationService.sendGraphObject(this.selectedGraphObject);
    // console.log("Sent graoh object from searchflow. Object: " + this.selectedGraphObject);
    this.router.navigate(['/pages/flow/design'], { relativeTo: this.route });
    /*
    let navigationExtras: NavigationExtras = {
      queryParams: { 'graph_object': this.selectedGraphObject }
    };
    this.router.navigate(['/designflow'], navigationExtras);
    */
  }

  ngOnInit() {
    this.fetchGraphs();
  }

  fetchGraphs(): void {
    this.graphService.fetch()
      .then(graphObjects => this.graphObjectList = graphObjects);
  }

  toInt(num: string) {
    return +num;
  }

  sortByWordLength = (a: any) => {
    return a.city.length;
  }
}
