import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {
  GraphObject, DataPoint, Classifier, StateModel,
  EventModel, Expression, Transition, ManualAction, DataPointValidation
} from '../../../../models/flow.model';

import { User, UserHierarchy, UserGroup, UserGraphObject } from '../../../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { GraphService, CommunicationService } from '../../../../services/flow.service';
import { StateService} from '../../../../services/inbox.service';
import { UniversalUser } from '../../../../services/shared.service';
import { FetchUserService, UserGraphService } from '../../../../services/userhierarchy.service';
import { DateRangePickerComponent } from './daterangepicker/daterangepicker.component';
import { State,CommonInsightWrapper,StateReportModel } from '../../../../models/tasks.model';

@Component({
  selector: 'api-inbox-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.scss'],
  providers: [FetchUserService, UserGraphService,StateService]
})



export class DashboardComponent implements OnInit, OnDestroy {

    private subscriptionUsers: Subscription;
    private tatSubscription: Subscription;
    buttonSelected:boolean = false;
    progressBarFlag:boolean = false;
    personal:boolean = false;
    companyId:string;
    userId:string;
    Users: UserHierarchy[] = [];
    tempUsers:UserHierarchy[] = [];
    buttonClicked: boolean = false;
    Statuses:string[] = ["ACTIVE","CLOSED","ARCHIVE"];
    status:string;
    selectedDate:any;
    stateReportModel:StateReportModel = new StateReportModel();
    tatReports:StateReportModel[] = [];
    overallStateReportModel:StateReportModel = new StateReportModel();
    personalStateReportModel:StateReportModel = new StateReportModel();
    constructor(
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private communicationService: CommunicationService,
        private fetchUserService: FetchUserService,
        private stateService:StateService,
        private universalUser: UniversalUser
        
      ){

      }

    ngOnInit(): void {
        this.load()
      }
    
      ngOnDestroy(): void {
        if (this.subscriptionUsers && !this.subscriptionUsers.closed) {
          this.subscriptionUsers.unsubscribe();
        }
        if (this.tatSubscription && !this.tatSubscription.closed) {
            this.tatSubscription.unsubscribe();
          }
      }


      load(): void {
        
            this.getUserList()
            this.userId = this.universalUser.getUser()._id
            this.companyId = this.universalUser.getUser().companyId
          }


        getUserList(){
            this.subscriptionUsers = this.fetchUserService.getUserChildren()
            .subscribe(userChildren => {
              if (userChildren && userChildren.length > 0) {
                this.Users = userChildren;
                let userHier = new UserHierarchy();
                userHier.userId = this.userId;
                userHier.userName = "SELF"
                this.Users.push(userHier);
                this.personal = false;
              }
              else{
                this.personal = true;
              }
            });
        }

            pesonalTat(date:any){
                this.selectedDate = date;
            }



            submit(){
                this.stateReportModel.reportStartTime = this.selectedDate.start.format('DD/MM/YYYY');
                this.stateReportModel.reportEndTime = this.selectedDate.end.format('DD/MM/YYYY');
                this.stateReportModel.fromDate = this.selectedDate.start.format('DD/MM/YYYY');
                this.stateReportModel.toDate = this.selectedDate.end.format('DD/MM/YYYY');
                if(this.personal == false){
                for (let user of this.tempUsers) {
                    this.stateReportModel.assignedList.push(user.userId);
                }
               }
               else if(this.personal){
                this.stateReportModel.assignedList.push(this.userId)
               }

                    
                this.stateReportModel.statusCd = this.status;
                this.stateReportModel.reportStatusCd = this.status;
                this.stateReportModel.companyId = this.companyId;
                this.progressBarFlag = true;
                this.buttonSelected = false;


                this.tatSubscription = this.stateService.getPersonalStats(this.stateReportModel)
                .subscribe(report => {
                  console.log("personal")
                  console.log(report)
                  this.personalStateReportModel = report;
                });

                if (this.personal == false){
                  this.tatSubscription = this.stateService.getOverallStats(this.stateReportModel)
                  .subscribe(report => {
                    console.log("overall")
                    console.log(report)
                    console.log(this.stateReportModel)
                    this.overallStateReportModel = report;
                  });
                }


                this.tatSubscription = this.stateService.getTatRecords(this.stateReportModel)
                .subscribe(reports => {
                  if (reports && reports.length > 0) {
                    this.stateReportModel = new StateReportModel();
                    this.tatReports = reports;
                    this.buttonSelected = true;
                    this.progressBarFlag = false;
                  }
                  else{
                    this.stateReportModel = new StateReportModel()
                    this.tatReports = reports;
                    this.progressBarFlag = false;
                    this.buttonSelected = true;
                  }
                });

                
                
            }
      
}