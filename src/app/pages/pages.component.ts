import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import {RouteService} from './pages.service';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-right" translate>
        <div class="al-copy">&copy;<a href="http://www.automatapi.com" translate>{{'general.auto'}}</a> 2016</div>
      </div>
      <div class="al-footer-main clearfix">
        <ul class="al-share clearfix">
          <li><a href="https://www.facebook.com/automatapi/"><i class="socicon socicon-facebook"></i></a></li>
          <li><a href="https://twitter.com/AutomataPi"><i class="socicon socicon-twitter"></i></a></li>
        </ul>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class PagesComponent implements OnInit {

  constructor(private _menuService: BaMenuService, private routeService: RouteService) {
  }

  ngOnInit() {
    this.routeService.routes().then(routes => {
      this._menuService.updateMenuByRoutes(<Routes>routes);
    });
    // this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }
}
