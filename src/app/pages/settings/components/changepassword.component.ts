import { Component, OnInit,OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalState } from '../../../global.state';
import { AuthService } from '../../../services/auth.service';
import { UniversalUser, DataSharingService } from '../../../services/shared.service';

@Component({
    selector: 'api-change-password',
    templateUrl: './changepassword.component.html',
 
})
export class ChangePasswordComponent implements OnInit, OnDestroy{

constructor(private route: ActivatedRoute, private router: Router){

}

    ngOnInit() {
        this.router.navigate(['/pg/stp/stus/prf'], { relativeTo: this.route });
        
      }

      ngOnDestroy() {
        
      }

}