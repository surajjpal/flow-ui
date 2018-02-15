declare var userHierarchyEditor: any;
declare var saveUserObject: any;
declare var updateUserObject: any;
declare var exportUserXml:any;
declare var discardGraph:any;
declare var addRootUserOrLoad:any;
declare var alertMessage:any;


import { Component, OnInit, OnDestroy,NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {
    GraphObject, DataPoint, Classifier, StateModel,
    EventModel, Expression, Transition, ManualAction, DataPointValidation
  } from '../../../../models/flow.model';

import {User, UserHierarchy, UserGroup,UserGraphObject} from '../../../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { GraphService, CommunicationService } from '../../../../services/flow.service';
import { UniversalUser } from '../../../../services/shared.service';
import { FetchUserService, UserGraphService } from '../../../../services/userhierarchy.service';

@Component({
    selector: 'api-user',
    templateUrl: './userHierarchy.component.html',
    providers: [FetchUserService,UserGraphService]
   
   
  })

export class UserHierarchyComponent implements OnInit, OnDestroy {
    readOnly: boolean = false;
    tempUser: UserHierarchy = new UserHierarchy();
    updatedUser: UserHierarchy = new UserHierarchy();
    tempParentUser: UserHierarchy = new UserHierarchy();
    userTypes: string[] = ['user'];
    userGraphObject:UserGraphObject = new UserGraphObject();
    userDialogTitle: string = 'Add User';
    userDialogButtonName: string = 'Add';
    Users: UserHierarchy[] = [];
    masterUserList: UserHierarchy[] = [];
    companyId:string = "";
    warningHeader: string;
    warningBody: string;
    private subscriptionUsers: Subscription;

    constructor(
        private zone:NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private communicationService: CommunicationService,
        private userGraphService: UserGraphService,
        private fetchUserService: FetchUserService,
        private universalUser: UniversalUser
      ) {
        window['userHierarchyRef'] = { component: this, zone: zone };
    
        // this.readOnly = this.communicationService.isReadOnly();
        // if (this.readOnly) {
        //   this.communicationService.setReadOnly(false);
        // }
    
        // this.graphObject = this.communicationService.getGraphObject();
        // if (this.graphObject) {
        //   this.communicationService.sendGraphObject(null);
        // }
  
      }
    
   

    ngOnInit(): void {
       this.load()
      }
    
    ngOnDestroy(): void {
        if (this.subscriptionUsers && !this.subscriptionUsers.closed) {
            this.subscriptionUsers.unsubscribe();
        }
      }

      load(): void {

        this.getUserList()
        this.companyId = this.universalUser.getUser().companyId
        console.log(this.companyId)
        this.getUserGraphObject()
        new userHierarchyEditor();
        
        
       // new userHierarchyEditor();
      }

    saveUser(){
        const userObject: Object = JSON.parse(JSON.stringify(this.tempUser));
        new saveUserObject(userObject)
    }

    updateUser(){
        const userObject: Object = JSON.parse(JSON.stringify(this.tempUser));  // Very important line of code, don't remove
        new updateUserObject(userObject);
        if(this.updatedUser){
          this.updateUserListAfterDelete([this.updatedUser]);
        }
    }

    updateSelectedUser(user:UserHierarchy): void {
     this.tempUser = JSON.parse(JSON.stringify(user));
      this.updatedUser = user;
    }

    addRootUser(){
      const userObject: Object = JSON.parse(JSON.stringify(this.tempUser));
      new addRootUserOrLoad(null,userObject);
    }

    updateUserListAfterAdd(users){
      users.forEach((user, index) => {
        this.Users.forEach((present_user,current_index) =>{
          if(user.userId === present_user.userId ){
            this.Users.splice(current_index,1)
          }
        });
      });
    }

    updateUserListAfterDelete(users){
      users.forEach((user, index) => {
        this.Users.push(user)
      });
    }


    saveOnServer() {
      // This will call a method in app.js and it will convert mxGraph into xml
      // and send it back to this component in method saveGraphXml(xml: string)
      try {
        
        new exportUserXml();
       
       } catch (exception) {
       console.log(exception)
      }
    }

    saveUserXml(xml:string,users:UserHierarchy[]){
      if (xml && this.userGraphObject) {
       
          this.userGraphObject.xml = xml;
          this.userGraphObject.userHierarchy = users;
       
        
        this.subscriptionUsers = this.userGraphService.saveUserGraphObject(this.userGraphObject)
          .subscribe(userGraphObject => {
            this.userGraphObject = userGraphObject;
            //this.router.navigate(['/pg/stp/stu'], { relativeTo: this.route });
            new alertMessage("User Hierarchy has been saved successfully!!");
            // this.router.navigate(['/pg/flw/flsr'], { relativeTo: this.route });
          });

        this.subscriptionUsers = this.userGraphService.saveUserHierarchy(users)
          .subscribe(userGraphObject => {
           
            
          });
          
          
      }
    }
    
    discard(){
      new discardGraph(this.userGraphObject)
      this.Users = [];
      this.getUserList();
    }


    deleteUserGraph(userGraphObject){
      if (userGraphObject) {
        
           this.subscriptionUsers = this.userGraphService.deleteUserGraph(userGraphObject)
           .subscribe(userGraphObject => {
            new alertMessage("User Hierarchy has been discarded successfully!!");
             //delete user hierarchy
             
             });

          }
    }

    getUserGraphObject(){
      if (this.userGraphObject) {
       this.subscriptionUsers = this.userGraphService.getUserGraph(this.companyId)
          .subscribe(userGraphObject => {
            this.userGraphObject = userGraphObject;
            new addRootUserOrLoad(userGraphObject.xml,null);
            
            
            // this.router.navigate(['/pg/flw/flsr'], { relativeTo: this.route });
          });
          
          
      }
    }

  getUserList(){
    this.subscriptionUsers = this.fetchUserService.fetchUsers()
      .subscribe(userList => {
        if (userList && userList.length > 0) {
          this.Users = userList;
          this.masterUserList = userList;
             
        }
      });
     }


  onUserSelect(user){
    this.tempUser.userName = user.userName;
    this.tempUser.userId = user.userId;
    this.tempUser.companyId = user.companyId;
  }

  addUser(user: UserHierarchy, parentUser: UserHierarchy): void {
        if (parentUser) {
         
          
          this.tempUser = new UserHierarchy();
          this.tempUser.parentUserName = parentUser.userName;
          this.tempUser.parentUserId = parentUser.userId;
         } else {
          
          this.tempUser = new UserHierarchy();
        }
    
        if (user) {
          this.userDialogTitle = 'Update User';
          this.userDialogButtonName = 'Update';
          this.tempUser = user;
        } else {
          this.userDialogTitle = 'Add User';
          this.userDialogButtonName = 'Add';
    
          
          // 
        }
      }


      showAppJSWarning(header: string, body: string) {
        this.warningHeader = header;
        this.warningBody = body;
      }
    
    
}