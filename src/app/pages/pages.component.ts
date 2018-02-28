import { Component, OnInit, OnDestroy } from '@angular/core';
import { Routes } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { RoutesService } from '../services/setup.service';

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
        <div class="al-copy">&copy;<a href="http://www.automatapi.com" translate>{{'general.auto'}}</a> 2018</div>
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
export class PagesComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private _menuService: BaMenuService, private routesService: RoutesService) {
  }

  ngOnInit(): void {
    this.subscription = this.routesService.routes()
    .subscribe(routes => {
      console.log(routes)
      this._menuService.updateMenuByRoutes(<Routes>routes);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}
