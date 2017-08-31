import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalState } from '../../../global.state';
import { AuthService } from '../../../shared/shared.service';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  isScrolled: boolean = false;
  isMenuCollapsed: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _state: GlobalState,
    private authService: AuthService
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  signOut() {
    this.authService.logout();
  }

  profile() {
    this.router.navigate(['/pages/master/updateUser/profile'], { relativeTo: this.route });
  }
}
