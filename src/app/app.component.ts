import { Component, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme/theme.config';
import { layoutPaths } from './theme/theme.constants';

import { AuthService } from './services/auth.service';
import { commonKeys } from './models/constants';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  styleUrls: ['./app.component.scss'],
  template: `
    <main [class.menu-collapsed]="isMenuCollapsed" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
    <ng2-slim-loading-bar></ng2-slim-loading-bar>
  `
})
export class App {

  isMenuCollapsed: boolean = false;

  constructor(private _state: GlobalState,
    private _imageLoader: BaImageLoaderService,
    private _spinner: BaThemeSpinner,
    private viewContainerRef: ViewContainerRef,
    private themeConfig: BaThemeConfig,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {

    themeConfig.config();

    this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });

    window.addEventListener('storage', (event) => {
      if (event.key === commonKeys.sessionExpired) {
        if ((this.route.snapshot.queryParams[commonKeys.returnUrl] || null) === null) {
          this.authService.logout(this.router.url);
        }
      } else if (event.key === commonKeys.sessionAvailable) {
        const redirectUrl = this.route.snapshot.queryParams[commonKeys.returnUrl] || '/';
        this.router.navigate([redirectUrl]);
      }
    }, false);
  }

  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
    });
  }

  private _loadImages(): void {
    // register some loaders
    BaThemePreloader.registerLoader(this._imageLoader.load('assets/img/sky-bg.jpg'));
  }
}
