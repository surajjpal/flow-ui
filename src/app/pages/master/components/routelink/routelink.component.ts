declare var closeModal: any;

import { Component, OnInit } from '@angular/core';

import { RoleRouteMap } from '../../master.model';
import { RoutesService } from '../../master.service';

@Component({
  selector: 'api-route',
  templateUrl: 'routelink.component.html',
  styleUrls: ['routelink.scss']
})
export class RoutelinkComponent implements OnInit {

  roleRouteList: RoleRouteMap[];
  roleMasterList: string[];
  routeMasterList: string[];
  selectedRoleRouteMap: RoleRouteMap;

  filterQuery: string;
  modalHeader: string;
  createMode: boolean;
  loading: boolean;

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

  fetchRoleRouteList() {
    this.routesService.getAllRoutes()
    .then(
      roleRouteList => {
        this.loading = false;

        if (roleRouteList) {
          this.roleRouteList = roleRouteList;
        }
      },
      error => {
        this.loading = false;
      }
    ).catch(
      error => {
        this.loading = false;
      }
    );
  }

  fetchRoleMasterList() {
    this.routesService.rolesMaster()
    .then(
      roleMasterList => {
        if (roleMasterList) {
          this.roleMasterList = roleMasterList;
        }
      },
      error => {
        
      }
    );
  }

  fetchRouteMasterList() {
    this.routesService.routesMaster()
    .then(
      routeMasterList => {
        if (routeMasterList) {
          this.routeMasterList = routeMasterList;
        }
      },
      error => {
        
      }
    );
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
    this.routesService.createRoute(this.selectedRoleRouteMap)
    .then(
      roleRouteMap => {
        new closeModal('detailsModal');
        this.fetchRoleRouteList();
      },
      error => {
        this.loading = false;
      }
    )
    .catch(
      error => {
        this.loading = false;
      }
    );
  }

  updateRoute() {
    this.routesService.updateRoute(this.selectedRoleRouteMap)
    .then(
      roleRouteMap => {
        new closeModal('detailsModal');
        this.fetchRoleRouteList();
      },
      error => {
        this.loading = false;
      }
    )
    .catch(
      error => {
        this.loading = false;
      }
    );
  }

  deleteRoute() {
    this.routesService.deleteRoute(this.selectedRoleRouteMap)
    .then(
      roleRouteMap => {
        new closeModal('detailsModal');
        this.fetchRoleRouteList();
      },
      error => {
        this.loading = false;
      }
    )
    .catch(
      error => {
        this.loading = false;
      }
    );
  }
}
