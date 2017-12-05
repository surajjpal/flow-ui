declare var closeModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { RoleRouteMap } from '../../../../models/setup.model';
import { RoutesService } from '../../../../services/setup.service';

@Component({
  selector: 'api-route',
  templateUrl: 'routelink.component.html',
  styleUrls: ['routelink.scss']
})
export class RoutelinkComponent implements OnInit, OnDestroy {

  roleRouteList: RoleRouteMap[];
  roleMasterList: string[];
  routeMasterList: string[];
  selectedRoleRouteMap: RoleRouteMap;

  filterQuery: string;
  modalHeader: string;
  createMode: boolean;
  loading: boolean;

  private subscription: Subscription;
  private subscriptionRoleRoute: Subscription;
  private subscriptionRoleMaster: Subscription;
  private subscriptionRouteMaster: Subscription;

  constructor(
    private routesService: RoutesService
  ) {
    this.roleRouteList = [];
    this.roleMasterList = [];
    this.routeMasterList = [];
    this.selectedRoleRouteMap = new RoleRouteMap();

    this.filterQuery = '';
    this.modalHeader = 'Update Route';
    this.createMode = false;
    this.loading = false;
  }

  ngOnInit() {
    this.fetchRoleRouteList();
    this.fetchRoleMasterList();
    this.fetchRouteMasterList();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionRoleRoute && !this.subscriptionRoleRoute.closed) {
      this.subscriptionRoleRoute.unsubscribe();
    }
    if (this.subscriptionRoleMaster && !this.subscriptionRoleMaster.closed) {
      this.subscriptionRoleMaster.unsubscribe();
    }
    if (this.subscriptionRouteMaster && !this.subscriptionRouteMaster.closed) {
      this.subscriptionRouteMaster.unsubscribe();
    }
  }

  fetchRoleRouteList() {
    this.subscriptionRoleRoute = this.routesService.getAllRoutes()
    .subscribe(roleRouteList => {
      if (roleRouteList) {
        this.roleRouteList = roleRouteList;
      }
    });
  }

  fetchRoleMasterList() {
    this.subscriptionRoleMaster = this.routesService.rolesMaster()
    .subscribe(roleMasterList => {
      if (roleMasterList) {
        this.roleMasterList = roleMasterList;
      }
    });
  }

  fetchRouteMasterList() {
    this.subscriptionRouteMaster = this.routesService.routesMaster()
    .subscribe(routeMasterList => {
      if (routeMasterList) {
        this.routeMasterList = routeMasterList;
      }
    });
  }

  onSelect(roleRouteMap: RoleRouteMap) {
    if (roleRouteMap) {
      this.createMode = false;
      this.modalHeader = 'Update Route';
      this.selectedRoleRouteMap = JSON.parse(JSON.stringify(roleRouteMap));
    } else {
      this.createMode = true;
      this.modalHeader = 'Create Route';
      this.selectedRoleRouteMap = new RoleRouteMap();
    }
  }

  createRoute() {
    this.loading = true;
    this.subscription = this.routesService.createRoute(this.selectedRoleRouteMap)
    .subscribe(
      roleRouteMap => {
        new closeModal('detailsModal');
        this.loading = false;
        this.fetchRoleRouteList();
      },
      error => {
        this.loading = false;
      }
    );
  }

  updateRoute() {
    this.loading = true;
    this.subscription = this.routesService.updateRoute(this.selectedRoleRouteMap)
    .subscribe(
      roleRouteMap => {
        new closeModal('detailsModal');
        this.loading = false;
        this.fetchRoleRouteList();
      },
      error => {
        this.loading = false;
      }
    );
  }

  deleteRoute() {
    this.loading = true;
    this.subscription = this.routesService.deleteRoute(this.selectedRoleRouteMap)
    .subscribe(
      roleRouteMap => {
        new closeModal('detailsModal');
        this.loading = false;
        this.fetchRoleRouteList();
      },
      error => {
        this.loading = false;
      }
    );
  }
}
