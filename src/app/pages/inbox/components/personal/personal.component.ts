import { v4 as uuid } from 'uuid';
declare var closeModal: any;
declare var showModal: any;
declare var showAlertModal: any;

import { Component, OnInit, OnDestroy, Input, Output, NgZone, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { State, TimelineStateAuditData, TaskDecision, Document } from '../../../../models/tasks.model';
import { StateService, DataCachingService } from '../../../../services/inbox.service';
import { BaThemeSpinner } from '../../../../theme/services';
import { UserHierarchy, User } from '../../../../models/user.model';
import { FetchUserService, AllocateTaskToUser } from '../../../../services/userhierarchy.service';
import { GraphObject, DataPoint, StateModel, ManualAction, StateInfoModel } from '../../../../models/flow.model';
import { UniversalUser } from 'app/services/shared.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { FileService } from 'app/services/setup.service';

@Component({
  selector: 'api-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.scss'],
  providers: [FetchUserService, AllocateTaskToUser]
})

export class PersonalComponent implements OnInit, OnDestroy {
  sortBy = '';
  sortOrder = 'asc';
  filterQuery = '';

  @Input()
  rawDataArray: Map<string, string>[];

  @Input()
  isLoading: Boolean = false;

  @Output()
  selectedData: EventEmitter<any> = new EventEmitter<any>();

  TABLINKS_ACTIVE = "block active";
  TABLINKS = "block"

  selectedStateForFlag: State;
  selectedState: State;
  selectedStateCd: string;
  actionMap: any;
  fieldKeyMap: any;
  assignedStates: State[];
  tempAssignedStates: State[];
  assignedTaskDdetails: State;
  assignedStateTabclass = {};
  assignedTaskActionButtonEnabled = {};

  unassignedStates: State[];
  unassignedTaskDdetails: State;
  unassignedStateTabclass = {};
  unassignedTaskActionButtonEnabled = {};

  flaggedStates: State[];
  flaggedTaskDdetails: State;
  flaggedStateTabclass = {};


  assistModeFl: boolean = false;
  virtualAgentURL: SafeResourceUrl = '';

  loadingUnassigned: boolean = false;
  loadingAssigned: boolean = false;
  loadingFlagged: boolean = false;
  unassignedHeaderParamList: string[];
  assignedHeaderParamList: string[];
  flaggedHeaderParamList: string[] = [];
  dataPoints: DataPoint[];
  progressBarFlag: boolean = false;
  pageNumber: any;
  assignedTaskPageNumber: number;
  unassignedTaskPageNumber: number;
  flaggedTaskPageNumber: number;
  fetchRecords: any;
  iterationLevel: number;
  responseError: string;
  FlagReasons: string[] = ['Customer did not answer', 'Customer not reachable', 'Customer rescheduled'];
  graphObject: GraphObject;
  graphObjects = new Map();
  assignedStategraphObject: GraphObject;
  arrayTableHeaders = {};
  timelineStates: TimelineStateAuditData[];
  selectedTimeLineState: TimelineStateAuditData;
  documentsForState = {};
  documentsToBeUploaded = [];
  selectedDocument: Document;
  selectedTab: string;
  DOCUMENT_STATUS = ["PENDING", "APPROVED", "REJECTED" ];

  // users
  userId: string
  users: UserHierarchy[] = [];
  userHierarchy: UserHierarchy = new UserHierarchy();
  allocatedAssignedTaskToUserId: string;
  allocatedUnAssignedTaskToUserId: string;
  tempUser: User;

  TAB_ASSIGNED = 'ASSIGNED';
  TAB_UNASSIGNED = 'UNASSIGNED';
  TAB_FLAGGED = 'FLAGGED';
  personalFetched = false;
  groupFetched = false;
  flaggedFetched = false;
  taskDecision: TaskDecision;

  private subscription: Subscription;
  private subscriptionGroup: Subscription;
  private subscriptionPersonal: Subscription;
  private subscriptionXML: Subscription;
  
  
  
  constructor(
    private stateService: StateService,
    private baThemeSpinner: BaThemeSpinner,
    private dataCachingService: DataCachingService,
    private router: Router,
    private route: ActivatedRoute,
    private fetchUserService: FetchUserService,
    private fileService: FileService,
    private universalUser: UniversalUser,
    private sanitizer: DomSanitizer,
    private allocateTaskToUser: AllocateTaskToUser
  ) {
    this.unassignedStates = [];
    this.assignedStates = [];
    this.tempAssignedStates = [];
    this.flaggedStates = [];
    this.assignedStateTabclass = {};
    this.assignedTaskDdetails = null;
    this.unassignedTaskDdetails = null;
    this.flaggedTaskDdetails = null;
    this.assignedTaskActionButtonEnabled = {};
    this.assignedStategraphObject = new GraphObject();
    this.allocatedAssignedTaskToUserId = null;
    this.allocatedUnAssignedTaskToUserId = null;
    this.selectedTimeLineState = new TimelineStateAuditData();
    this.taskDecision = new TaskDecision();
    this.selectedDocument = new Document();
    //this.selectedStateForFlag = State;
  }

  ngOnInit(): void {
    //this.baThemeSpinner.show();
    this.progressBarFlag = true;
    //this.baThemeSpinner.show();
    this.pageNumber = 0
    this.assignedTaskPageNumber = 0;
    this.unassignedTaskPageNumber = 0;
    this.flaggedTaskPageNumber = 0;
    this.fetchRecords = 10
    // this.fetchData(this.pageNumber, this.fetchRecords);
    this.fetchRecordsFor(this.TAB_ASSIGNED, this.assignedStates);
    this.graphObject = this.dataCachingService.getGraphObject();
    if (!this.graphObject) {
      this.graphObject = new GraphObject();
    }
    this.userId = this.universalUser.getUser()._id
    this.getUserList();
    this.getParentUser();
  }

  getUserList() {

    this.subscription = this.fetchUserService.fetchChildUsers(this.userId)
      .subscribe(userList => {
        if (userList && userList.length > 0) {
          //document.getElementById('#alocateButton').style.visibility = 'visible';
          this.users = userList;


        }
      });
  }

  getParentUser() {
    this.subscription = this.fetchUserService.getUserHierarchy(this.userId)
      .subscribe(userHierarchyObject => {

        if (userHierarchyObject) {
          //document.getElementById('#alocateButton').style.visibility = 'visible';
          this.userHierarchy = userHierarchyObject;


        }

      });

  }

  timeline(state: State) {

    this.timelineStates = [];
    this.subscription = this.stateService.getTimelineForFlow(state.stateMachineInstanceModelId)
      .subscribe(timelineStates => {
        if (timelineStates) {
          this.timelineStates = timelineStates;
          if (this.timelineStates.length > 0) {
            this.selectedTimeLineState = this.timelineStates[0];
          }

        }
      });
  }

  agentAssist(state: State): void {
    this.stateService.updateVirtualAssist(this.assignedTaskDdetails)
      .subscribe(
        contextData => {
          if (contextData) {
            
          }
          this.assistModeFl = true;
          this.virtualAgentURL = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.autoworkbench + state.assignedVirtualAgentId + `/` + state.entityId + environment.autoworkbenchdisplaybar}`);
        },
        error => {
          
        }
      )
    
  }


  closeAgentAssist(): void {
    this.assistModeFl = false;
  }

  timelineSelect(timeLineState: TimelineStateAuditData) {
    this.selectedTimeLineState = timeLineState;
  }

  ngOnDestroy(): void {
    if (this.subscriptionGroup && !this.subscriptionGroup.closed) {
      this.subscriptionGroup.unsubscribe();
    }
    if (this.subscriptionPersonal && !this.subscriptionPersonal.closed) {
      this.subscriptionPersonal.unsubscribe();
    }
  }

  fetchData(pageNumber, fetchRecords): void {
    this.loadingAssigned = true;
    this.loadingUnassigned = true;
    this.loadingFlagged = true

    this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder('ACTIVE', 'Group', this.assignedTaskPageNumber, fetchRecords)
      .subscribe(states => {
        if (states != null && states.length > 0) {
          this.setFirstUnAssignedTaskValues(states);
          this.unassignedStates = states;
        }
        else {
          this.loadingAssigned = false;
          if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
            this.progressBarFlag = false;
            // this.baThemeSpinner.hide();
          }
        }


      }, error => {
        this.loadingUnassigned = false;
        if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }
      });

    this.subscriptionPersonal = this.stateService.getStatesByStatusAndFolder('ACTIVE', 'Personal', this.unassignedTaskPageNumber, fetchRecords)
      .subscribe(states => {
        if (states != null && states.length > 0) {
          this.setFirstAssignedTaskValues(states);
          this.assignedStates = states;
          this.tempAssignedStates = JSON.parse(JSON.stringify(states));
        }
        else {
          this.loadingAssigned = false;
          if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
            this.progressBarFlag = false;
            // this.baThemeSpinner.hide();
          }
        }


      }, error => {
        this.loadingAssigned = false;
        if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }
      });


    this.subscriptionGroup = this.stateService.getStatesBySubStatusAndFolder('FLAGGED', 'CLOSED', this.flaggedTaskPageNumber, this.fetchRecords, 'PERSONAL')
      .subscribe(states => {
        if (states != null && states.length > 0) {
          this.setFirstFlaggedTaskValues(states);
          this.flaggedStates = states;
        }
        else {
          this.loadingFlagged = false;
          if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
            this.progressBarFlag = false;
            // this.baThemeSpinner.hide();
          }

        }


      }, error => {
        this.loadingFlagged = false;
        if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }
      });

  }

  loadMore(status, type): void {

    this.progressBarFlag = true;
    this.loadingAssigned = true;
    this.loadingUnassigned = true;
    this.pageNumber = this.pageNumber + 1;
    if (status != "FLAGGED") {
      if (type == "Personal") {
        this.assignedTaskPageNumber = this.assignedTaskPageNumber + 1;
        this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder(status, type, this.assignedTaskPageNumber, this.fetchRecords)
          .subscribe(states => {
            if (states != null && states.length == 0) {
              new showAlertModal("No more data available");
            }
            if (type == 'Personal') {
              if (this.assignedStates.length == 0) {
                this.setFirstAssignedTaskValues(states);
                this.assignedStates = states;

              }
              else {
                for (let state of states) {
                  this.assignedStateTabclass[state._id] = "block";
                  this.assignedTaskActionButtonEnabled[state._id] = true;
                  this.setGraphObjects(state);
                }
                this.assignedStates = this.assignedStates.concat(states)
                this.tempAssignedStates = this.tempAssignedStates.concat(JSON.parse(JSON.stringify(states)));
              }

              this.loadingAssigned = false;
            }
            if (!this.loadingUnassigned && !this.loadingAssigned) {

              //this.baThemeSpinner.hide();
            }
            this.progressBarFlag = false;
          }, error => {
            this.loadingUnassigned = false;
            this.progressBarFlag = false;
            if (!this.loadingUnassigned && !this.loadingAssigned) {

              //this.baThemeSpinner.hide();
            }
          });
      }
      else {
        this.unassignedTaskPageNumber = this.unassignedTaskPageNumber + 1;
        this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder(status, type, this.unassignedTaskPageNumber, this.fetchRecords)
          .subscribe(states => {
            if (states != null && states.length == 0) {
              new showAlertModal("No more data available");
            }
            if (type == 'Group') {
              if (this.unassignedStates.length == 0) {
                this.setFirstUnAssignedTaskValues(states);
                this.unassignedStates = states;
              }
              else {
                for (let state of states) {
                  this.unassignedStateTabclass[state._id] = "block";
                  this.unassignedTaskActionButtonEnabled[state._id] = true;
                  this.setGraphObjects(state);
                }
                this.unassignedStates = this.unassignedStates.concat(states)
              }

              this.loadingUnassigned = false;
            }

            if (!this.loadingUnassigned && !this.loadingAssigned) {
              this.progressBarFlag = false;
              //this.baThemeSpinner.hide();
            }
            this.progressBarFlag = false;
          }, error => {
            this.loadingUnassigned = false;
            if (!this.loadingUnassigned && !this.loadingAssigned) {
              this.progressBarFlag = false;
              //this.baThemeSpinner.hide();
            }
            this.progressBarFlag = false;
          });
      }

    }
    else {
      this.flaggedTaskPageNumber = this.flaggedTaskPageNumber + 1;
      this.subscriptionGroup = this.stateService.getStatesBySubStatusAndFolder('FLAGGED', 'CLOSED', this.flaggedTaskPageNumber, this.fetchRecords, 'PERSONAL')
        .subscribe(states => {
          if (states != null && states.length == 0) {
            new showAlertModal("No more data available");
          }
          if (this.flaggedStates.length == 0) {
            this.setFirstFlaggedTaskValues(states);
            this.flaggedStates = states;
          }
          else {
            for (let state of states) {
              this.flaggedStateTabclass[state._id] = "block";
              this.setGraphObjects(state);
            }
            this.flaggedStates = this.flaggedStates.concat(states)
          }
          this.progressBarFlag = false;
        }, error => {
          this.progressBarFlag = false;
        });

    }
  }
  onSelect(selectedData: any): void {
    this.progressBarFlag = true;
    this.selectedData.emit(selectedData);
    this.selectedState = selectedData;
    this.selectedStateCd = selectedData.stateCd;

    this.subscriptionXML = this.stateService.getXMLforActiveState(selectedData.stateMachineInstanceModelId)
      .subscribe(graphObject => {
        this.dataCachingService.setSharedObject(graphObject, this.selectedState);
        this.progressBarFlag = false;
        this.router.navigate(['/pg/tsk/tdts'], { relativeTo: this.route });
      });
  }

  goBack(): void {
    new closeModal('detailsModal');
    this.ngOnInit();
  }


  selectedForFlag(state): void {

    this.selectedStateForFlag = state;
    this.selectedStateForFlag.flagReason = this.FlagReasons[0];
    this.subscriptionXML = this.stateService.getXMLforActiveState(state.stateMachineInstanceModelId)
      .subscribe(graphObject => {
        this.dataCachingService.setSharedObject(graphObject, state);
        this.graphObject = graphObject

      });
  }

  close() {
    this.selectedStateForFlag.flagReason = "";
  }

  onReasonSelectAssignedTask(reason) {
    this.assignedTaskDdetails.flagReason = reason;
  }


  extractParams() {
    if (this.selectedStateForFlag) {
      if (!this.actionMap) {
        this.actionMap = {};
      }
      if (!this.fieldKeyMap) {
        this.fieldKeyMap = {};
      }
      if (!this.dataPoints) {
        this.dataPoints = [];
      }

      if (this.selectedStateForFlag.parameters && this.graphObject.dataPointConfigurationList) {
        for (const dataPoint of this.graphObject.dataPointConfigurationList) {
          const paramValue: any = this.selectedStateForFlag.parameters[dataPoint.dataPointName];

          if (dataPoint.dataType === 'STRING') {
            dataPoint.value = paramValue ? paramValue : '';
          } else if (dataPoint.dataType === 'BOOLEAN') {
            dataPoint.value = (paramValue !== null && (typeof paramValue === 'boolean' || paramValue instanceof Boolean)) ? paramValue : false;
          } else if (dataPoint.dataType === 'NUMBER') {
            dataPoint.value = (paramValue && (typeof paramValue === 'number' || paramValue instanceof Number)) ? paramValue : 0;
          } else if (dataPoint.dataType === 'SINGLE_SELECT') {
            if (paramValue && !(paramValue instanceof Array) && !dataPoint.inputSource.includes(paramValue)) {
              dataPoint.inputSource.push(paramValue);
            }

            dataPoint.value = paramValue;
          } else if (dataPoint.dataType === 'MULTI_SELECT') {
            const uniqueValues: string[] = [];

            if (paramValue && paramValue instanceof Array && paramValue.length > 0) {
              for (const value of paramValue) {
                if (!dataPoint.inputSource.includes(value)) {
                  uniqueValues.push(value);
                }

              }

              dataPoint.inputSource = dataPoint.inputSource.concat(uniqueValues);
            }

            dataPoint.value = paramValue;
          } else if (dataPoint.dataType === 'ARRAY') {
            dataPoint.value = (paramValue && paramValue instanceof Array) ? paramValue : [];
          } else if (dataPoint.dataType === 'ANY') {
            dataPoint.value = paramValue;
          } else {
            dataPoint.dataType = 'STRING';
            dataPoint.value = '';
          }

          /** ---------------------- IMPORTANT ----------------------
           * This is done on purpose, please don't remove.
           * Required for UI -> Inline form -> Label & Value
           * Object at even indices are used to create label div
           * Object at odd indices are used to create input field
           * while updating info on server only odd indices objects are selected
           **/
          this.dataPoints.push(dataPoint);
          this.dataPoints.push(dataPoint);

          this.fieldKeyMap[dataPoint.dataPointName] = dataPoint.dataPointLabel;
        }
      }
    }
  }

  updateFlow() {
    this.actionMap = JSON.parse(JSON.stringify(this.selectedState.parameters));

    for (let index = 0; index < this.dataPoints.length; index++) {
      if (index % 2 === 1) {
        const dataPoint = this.dataPoints[index];
        if (dataPoint.dataType === 'NUMBER' && (typeof dataPoint.value === 'string' || dataPoint.value instanceof String)) {
          dataPoint.value = +dataPoint.value;
        } else if (dataPoint.dataType === 'BOOLEAN' && (typeof dataPoint.value === 'string' || dataPoint.value instanceof String)) {
          dataPoint.value = (dataPoint.value === 'true');
        }
        this.actionMap[dataPoint.dataPointName] = dataPoint.value;
      }
    }

    // this.subscription = this.stateService.update(this.selectedStateForFlag.machineType, this.selectedStateForFlag.entityId, this.actionMap)
    //   .subscribe(response => {
    //     this.responseError = '';

    //     const state: State = response;

    //     if (state) {
    //       if (state.errorMessageMap) {
    //         for (const key in state.errorMessageMap) {
    //           if (key) {
    //             const errorList: string[] = state.errorMessageMap[key];

    //             this.responseError += `${this.fieldKeyMap[key]}<br>`;
    //             for (const error of errorList) {
    //               this.responseError += `  - ${error}<br>`;
    //             }
    //           }
    //         }

    //         if (!this.responseError || this.responseError.length <= 0) {
    //           new showModal('successModalPersonal');
    //         }
    //       } else {
    //         new showModal('successModalPersonal');
    //       }
    //     } else {
    //       new showModal('successModalPersonal');
    //     }
    //   });
  }

  onBack() {

  }

  confirm(): void {
    this.selectedStateForFlag.flagged = true;
    this.iterationLevel = this.selectedStateForFlag.iterationLevel;
    this.iterationLevel = this.iterationLevel + 1;
    this.selectedStateForFlag.iterationLevel = this.iterationLevel;
    this.selectedStateForFlag.subStatus = "FLAGGED"
    this.extractParams();
    this.updateFlow();
    this.subscriptionXML = this.stateService.saveFlaggedState(this.selectedStateForFlag, this.actionMap)
      .subscribe(state => {

        //console.log(state)
        // this.selectedStateForFlag = state;
        new closeModal('flagModal');
        new showModal('successModalPersonal');
      });
  }

  setFirstAssignedTaskValues(states) {
    if (states != null && states.length > 0) {
      this.assignedStateTabclass[states[0]._id] = "block active";
      this.stateService.getDataPointconfigurationFromFlowInstanceId(states[0].stateMachineInstanceModelId)
        .subscribe(
          response => {
            this.graphObjects.set(states[0].stateMachineInstanceModelId, this.getSortedDatPointGraphObject(response));
            // console.log("setFirstAssignedTaskValues");
            // console.log(this.graphObjects);
            this.assignedTaskDdetails = states[0];
            this.getDocuments(this.assignedTaskDdetails);
            this.loadingAssigned = false;
            if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
              this.progressBarFlag = false;
              // this.baThemeSpinner.hide();
            }
            this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = true;
            this.assignedStategraphObject = response;
            for (let state of states) {
              if (this.assignedTaskDdetails != state) {
                this.assignedStateTabclass[state._id] = "block";
                this.setGraphObjects(state);
                this.assignedTaskActionButtonEnabled[state._id] = true;
              }
            }
          },
          error => {
            this.loadingAssigned = false;
            this.progressBarFlag = false;
            console.log("graph object not found");
          }
        )
    } else {
      this.progressBarFlag = false;
    }
  }

  

  setFirstFlaggedTaskValues(states) {
    if (states != null && states.length > 0) {
      this.flaggedStateTabclass[states[0]._id] = "block active";
      this.stateService.getDataPointconfigurationFromFlowInstanceId(states[0].stateMachineInstanceModelId)
        .subscribe(
          response => {
            this.graphObjects.set(states[0].stateMachineInstanceModelId, this.getSortedDatPointGraphObject(response));
            // console.log("setFirstFlaggedTaskValues");
            // console.log(this.graphObjects);
            this.flaggedTaskDdetails = states[0];
            this.getDocuments(this.flaggedTaskDdetails);
            this.loadingFlagged = false;
            if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
              this.progressBarFlag = false;
              // this.baThemeSpinner.hide();
            }
            for (let state of states) {
              if (this.flaggedTaskDdetails != state) {
                this.flaggedStateTabclass[state._id] = "block";
                this.setGraphObjects(state);

              }
            }

          },
          error => {
            this.loadingFlagged = false;
            this.progressBarFlag = false;
            console.log("graph object not found");
          }
        )
    } else {
      this.progressBarFlag = false;
    }
  }

  setFirstUnAssignedTaskValues(states) {
    if (states != null && states.length > 0) {
      this.unassignedStateTabclass[states[0]._id] = "block active";
      this.stateService.getDataPointconfigurationFromFlowInstanceId(states[0].stateMachineInstanceModelId)
        .subscribe(
          response => {
            this.graphObjects.set(states[0].stateMachineInstanceModelId, this.getSortedDatPointGraphObject(response));
            // console.log("setFirstUnAssignedTaskValues");
            // console.log(this.graphObjects);
            this.unassignedTaskDdetails = states[0];
            this.getDocuments(this.unassignedTaskDdetails);
            this.loadingUnassigned = false;
            if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
              this.progressBarFlag = false;
              // this.baThemeSpinner.hide();
            }
            this.unassignedTaskActionButtonEnabled[this.unassignedTaskDdetails._id] = true;
            for (let state of states) {
              if (this.unassignedTaskDdetails != state) {
                this.unassignedStateTabclass[state._id] = "block";
                this.setGraphObjects(state);
                this.unassignedTaskActionButtonEnabled[state._id] = true;
              }
            }
          },
          error => {
            this.loadingUnassigned = false;
            this.progressBarFlag = false;
            console.log("graph object not found");
          }
        )
    } else {
      this.progressBarFlag = false;
    }
  }

  onPersonalAssignedSubjectSelect(state: State) {
    this.assignedTaskDdetails = state;
    this.getDocuments(this.assignedTaskDdetails);
    for (let asgnState of this.assignedStates) {
      this.assignedStateTabclass[asgnState._id] = this.TABLINKS;
    }
    this.assignedStateTabclass[state._id] = this.TABLINKS_ACTIVE;
    this.assignedStategraphObject = this.graphObjects.get(state.stateMachineInstanceModelId);
  }

  onPersonalUnAssignedSubjectSelect(state: State) {
    this.unassignedTaskDdetails = state;
    this.getDocuments(this.unassignedTaskDdetails);
    for (let unasgnState of this.unassignedStates) {
      this.unassignedStateTabclass[unasgnState._id] = this.TABLINKS;
    }
    this.unassignedStateTabclass[state._id] = this.TABLINKS_ACTIVE;

  }

  onFlaggedSubjectSelect(state: State) {
    this.flaggedTaskDdetails = state;
    this.getDocuments(this.flaggedTaskDdetails);
    for (let flgState of this.flaggedStates) {
      this.flaggedStateTabclass[flgState._id] = this.TABLINKS;
    }
    this.flaggedStateTabclass[state._id] = this.TABLINKS_ACTIVE;
  }

  getSortedDatPointGraphObject(graphObject: GraphObject) {
    if (graphObject != null && graphObject.dataPointConfigurationList != null && graphObject.dataPointConfigurationList.length > 0) {
      const dataPointsConfig = JSON.parse(JSON.stringify(graphObject.dataPointConfigurationList));
      dataPointsConfig.sort(function (a: DataPoint, b: DataPoint) {
        return a.sequence > b.sequence ? 1 : a.sequence ? -1 : 0
      });
      graphObject.dataPointConfigurationList = dataPointsConfig;

    }
    return graphObject;
  }

  setGraphObjects(state: State) {
    // console.log("setgraphobjects");
    // console.log(this.graphObjects.get(state.stateMachineInstanceModelId));
    if (!this.graphObjects.get(state.stateMachineInstanceModelId) || this.graphObjects.get(state.stateMachineInstanceModelId) != null) {
      this.stateService.getDataPointconfigurationFromFlowInstanceId(state.stateMachineInstanceModelId)
        .subscribe(
          response => {
            this.graphObjects.set(state.stateMachineInstanceModelId, this.getSortedDatPointGraphObject(response));

          },
          error => {

          }
        )
    }
    else {
      this.graphObjects.set(state.stateMachineInstanceModelId, null);
    }

  }

  getGraphObject(stateMachineInstanceModelId: string) {
    return this.graphObjects.get(stateMachineInstanceModelId);
  }

  getBusinessKey(stateMachineInstanceModelId: string) {
    if (this.graphObjects.get(stateMachineInstanceModelId) != null) {
      const dataPoints = this.graphObjects.get(stateMachineInstanceModelId).dataPointConfigurationList;
      for (let data of dataPoints) {
        if (data.businessKeyFlag) {
          return data.dataPointLabel;
        }
      }
    }
    return "Business key";
  }

  getBusinessKeysWithoutTable(selectedTask: State) {
    let dataPoints: DataPoint[];
    dataPoints = [];
    if (this.graphObjects.get(selectedTask.stateMachineInstanceModelId) != null && this.graphObjects.get(selectedTask.stateMachineInstanceModelId).dataPointConfigurationList != null && this.graphObjects.get(selectedTask.stateMachineInstanceModelId).dataPointConfigurationList.length > 0) {
      const dataPointsConfig = this.graphObjects.get(selectedTask.stateMachineInstanceModelId).dataPointConfigurationList;
      // console.log("dataPoints");
      // console.log(orderedDataPoints);
      for (let data of dataPointsConfig) {
        if (!data.businessKeyFlag) {
          if (data.dataType == "ARRAY" && data.childdataPoints != null && data.childdataPoints.length > 0) {

          }
          else {
            dataPoints.push(data);
          }

        }
      }
    }
    return dataPoints;
  }

  getStatusList(selectedTask: State) {
    if (this.graphObjects.get(selectedTask.stateMachineInstanceModelId) != null && this.graphObjects.get(selectedTask.stateMachineInstanceModelId).states) {
      for (let state of this.graphObjects.get(selectedTask.stateMachineInstanceModelId).states) {
        if (state.stateCd && selectedTask.stateCd && state.stateCd == selectedTask.stateCd && state.statusList) {
          return state.statusList;
        }
      }
    }
    return [];
  }

  getBusinessKeysWithTable(selectedTask: State) {
    //console.log(this.assignedTaskDdetails);
    let arrayDataPoints: DataPoint[];
    arrayDataPoints = [];
    if (this.graphObjects.get(selectedTask.stateMachineInstanceModelId) != null) {
      const dataPointsConfig = this.graphObjects.get(selectedTask.stateMachineInstanceModelId).dataPointConfigurationList;
      for (let data of dataPointsConfig) {
        if (data != null && !data.businessKeyFlag) {
          if (data.dataType == "ARRAY" && selectedTask['parameters'] != null && selectedTask['parameters'][data.dataPointName] != null && selectedTask['parameters'][data.dataPointName].length > 0 && typeof selectedTask['parameters'][data.dataPointName] != "string") {
            arrayDataPoints.push(data)
          }
          else {

          }

        }
      }
    }
    //console.log("getBusinessKeysWithTable");
    //console.log(selectedTask);
    return arrayDataPoints;
  }

  getHeaderDataPointsForArrayDataType(dataPoint: DataPoint, state: State) {
    this.arrayTableHeaders = {};
    let headers = [];
    if (dataPoint.childdataPoints != null && dataPoint.childdataPoints.length > 0) {
      for (let childdata of dataPoint.childdataPoints) {
        this.arrayTableHeaders[childdata.dataPointName] = [];
        headers.push(childdata);
      }
    }
    else {
      if (state['parameters'] != null && state['parameters'][dataPoint.dataPointName] != null && state['parameters'][dataPoint.dataPointName].length > 0) {
        for (let key of state['parameters'][dataPoint.dataPointName]) {
          //console.log(key);
          this.arrayTableHeaders[key] = [];
          const newDataPoint = new DataPoint();
          newDataPoint.dataPointName = key;
          newDataPoint.dataPointLabel = key
          headers.push(newDataPoint);
        }
      }
    }
    //console.log(headers)
    return headers;

  }

  getValueForArraydatatype(dataPoint: DataPoint, state: State) {
    let values = []
    if (state['parameters'][dataPoint.dataPointName] != null) {
      for (let d of state['parameters'][dataPoint.dataPointName]) {
        // console.log("d");
        // console.log(d);
        let headerValue = []
        for (let dp of this.getHeaderDataPointsForArrayDataType(dataPoint, state)) {
          headerValue.push(d[dp.dataPointName])
        }
        values.push(headerValue);
      }
    }
    return values;
  }

  updateProcessFlow(state: State, type: string) {
    if (this.documentsForState && this.documentsForState[state._id] && this.documentsForState[state._id].length > 0) {
      if (this.validateDocuments(state)) {
        this.progressBarFlag = true;
        this.assignedTaskActionButtonEnabled[state._id] = false;
        this.uploadDocumentForTask(state, this.TAB_ASSIGNED);
      }
    }
    else {
      this.updateAssignedTask(state);
    }
  }

  updateAssignedTask(state: State) {
    this.progressBarFlag = true;
    this.assignedTaskActionButtonEnabled[state._id] = false;
    this.subscription = this.stateService.update(state.machineType, state.entityId, state['parameters'], state.taskStatus, state.taskRemarks, this.documentsForState[state._id], state._id)
      .subscribe(
        response => {
            this.assignedTaskActionButtonEnabled[state._id] = true;
          if (response) {
            const errorState: State = response;
            let erresponseError = "";
            if (errorState.errorMessageMap && Object.keys(errorState.errorMessageMap).length > 0) {
              for (const key in errorState.errorMessageMap) {
                if (key) {
                  const errorList: string[] = errorState.errorMessageMap[key];
  
                  erresponseError += `${this.fieldKeyMap[key]}<br>`;
                  for (const error of errorList) {
                    erresponseError += `  - ${error}<br>`;
                  }
                  new showModal(erresponseError);
                }
              }
            }
            else {
                this.progressBarFlag = false;
                new showModal('successModal');
                this.assignedTaskActionButtonEnabled[state._id] = true;
                this.removedAssignedTask(state);
            }
            
          }
          else {
              this.progressBarFlag = false;
              new showModal('successModal');
              this.assignedTaskActionButtonEnabled[state._id] = true;
              this.removedAssignedTask(state);
          }
        },
        error => {
          this.progressBarFlag = false;
          new showModal('Error in updating process');
        }
      );
  }

  reserveUnassignedTask(state: State) {
    this.unassignedTaskActionButtonEnabled[state._id] = false;
    this.subscription = this.allocateTaskToUser.allocateTask(this.userId, state._id, "Reserve")
      .subscribe(updatedState => {
        this.unassignedTaskActionButtonEnabled[state._id] = false;
        this.removedUnAssignedTask(state);
        if (this.assignedStates.length == 0) {
          this.assignedStateTabclass[state._id] = "block active";
        }
        else {
          this.assignedStateTabclass[updatedState._id] = "block";
        }
        this.assignedTaskActionButtonEnabled[updatedState._id] = true;
        this.setGraphObjects(updatedState);
        this.assignedStates.push(updatedState);
        this.tempAssignedStates.push(JSON.parse(JSON.stringify(updatedState)));
      },
        error => {
          this.unassignedTaskActionButtonEnabled[state._id] = false;
          new showAlertModal("Error", "error to reserve task")
        }
      );

  }

  onUserSelectAssignedTask(user) {

    this.allocatedAssignedTaskToUserId = user.userId;

  }

  onUserSelectUnAssignedTask(user) {

    this.allocatedUnAssignedTaskToUserId = user.userId;

  }

  allocateAssignedTask() {
    this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = false
    // console.log(this.allocatedAssignedTaskToUserId)
    if (this.allocatedAssignedTaskToUserId != null && this.allocatedAssignedTaskToUserId.length > 0) {
      this.subscription = this.allocateTaskToUser.allocateTask(this.allocatedAssignedTaskToUserId, this.assignedTaskDdetails._id, "Allocate")
        .subscribe(any => {
          this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = true;
          this.removedAssignedTask(this.assignedTaskDdetails);
        },
          error => {
            new closeModal('assginedUserModal');
            new showModal('error in allocate to team ');
          }
        )
    }
    else {
      new closeModal('assginedUserModal');
      new showModal('userNotSelected');
      this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = true;
    }

  }

  allocateUnAssignedTask() {
    this.unassignedTaskActionButtonEnabled[this.unassignedTaskDdetails._id] = false
    // console.log(this.allocatedUnAssignedTaskToUserId)
    if (this.allocatedUnAssignedTaskToUserId != null && this.allocatedUnAssignedTaskToUserId.length > 0) {
      this.subscription = this.allocateTaskToUser.allocateTask(this.allocatedUnAssignedTaskToUserId, this.unassignedTaskDdetails._id, "Allocate")
        .subscribe(any => {
          this.unassignedTaskActionButtonEnabled[this.unassignedTaskDdetails._id] = true;
          this.removedUnAssignedTask(this.unassignedTaskDdetails);
        },
          error => {
            new closeModal('unassginedUserModal');
            new showModal('error in allocate to team ');
          }
        )
      this.removedUnAssignedTask(this.unassignedTaskDdetails);
    }
    else {
      new closeModal('unassginedUserModal');
      new showModal('userNotSelected');
      this.unassignedTaskActionButtonEnabled[this.unassignedTaskDdetails._id] = true;
    }

  }

  removedAssignedTask(state: State) {
    let index = this.assignedStates.indexOf(state);
    // console.log("index");
    // console.log(index);
    if (index != -1) {
      this.assignedStates.splice(index, 1);
      //console.log(this.assignedTaskDdetails);
      if (this.assignedStates.length > 0) {
        // console.log(this.assignedTaskDdetails);
        if (index != this.assignedStates.length) {
          const displayState = this.assignedStates[index];
          this.assignedStateTabclass[displayState._id] = this.TABLINKS_ACTIVE;
          this.assignedTaskDdetails = displayState;
        }
        else {
          const displayState = this.assignedStates[index - 1];
          this.assignedStateTabclass[displayState._id] = this.TABLINKS_ACTIVE;
          this.assignedTaskDdetails = displayState;
        }
      }
      else {
        this.assignedTaskDdetails = null;
      }
    }

  }

  removedUnAssignedTask(state: State) {
    let index = this.unassignedStates.indexOf(state);
    // console.log("index");
    // console.log(index);
    if (index != -1) {
      this.unassignedStates.splice(index, 1);
      // console.log(this.unassignedTaskDdetails);
      if (this.unassignedStates.length > 0) {
        // console.log(this.unassignedTaskDdetails);
        if (index != this.unassignedStates.length) {
          const displayState = this.unassignedStates[index];
          this.unassignedStateTabclass[displayState._id] = this.TABLINKS_ACTIVE;
          this.unassignedTaskDdetails = displayState;
        }
        else {
          const displayState = this.unassignedStates[index - 1];
          this.unassignedStateTabclass[displayState._id] = this.TABLINKS_ACTIVE;
          this.unassignedTaskDdetails = displayState;
        }
      }
      else {
        this.unassignedTaskDdetails = null;
        this.loadMore('ACTIVE', 'Group')
      }

    }

  }

  assignedTaskFlagClose() {
    this.assignedTaskDdetails.flagReason = null;
  }

  assignedTaskConfirmFlag() {
    // console.log("flag reason");
    // console.log(this.assignedTaskDdetails.flagReason);
    this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = false;
    this.assignedTaskDdetails.flagged = true;
    this.assignedTaskDdetails.iterationLevel = this.assignedTaskDdetails.iterationLevel + 1;
    this.assignedTaskDdetails.subStatus = "FLAGGED"

    this.subscriptionXML = this.stateService.saveFlaggedState(this.assignedTaskDdetails, this.assignedTaskDdetails.parameters)
      .subscribe(state => {
        this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = true;
        this.removedAssignedTask(this.assignedTaskDdetails);
        if (this.flaggedStates.length == 0) {
          this.flaggedStateTabclass[state._id] = "block active";
        }
        else {
          this.flaggedStateTabclass[state._id] = "block";
        }
        this.setGraphObjects(state);
        this.flaggedStates.push(state);
        new closeModal('assignedTaskflagModal');
        new showModal('assignedTaskflagSuccessModal');

      },
        error => {
          this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = true;
          new showAlertModal('Error', "error to add flag for task");
        }
      );
  }

  archiveAssignedTask() {
    this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = false;
    let archivedState: State = null;
    for (let state of this.tempAssignedStates) {
      if (state._id == this.assignedTaskDdetails._id) {
        archivedState = state
      }
    }
    if (archivedState != null) {
      this.subscription = this.stateService.saveArchivedState(archivedState)
        .subscribe(State => {
          this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = true;
          this.removedAssignedTask(this.assignedTaskDdetails);
          new closeModal('archiveTaskWarningModal');
          new showModal('assignedTaskArchiveSuccessModal');
          //this.router.navigate(['/pg/tsk/pervi'], { relativeTo: this.route });
        },
          error => {
            this.assignedTaskActionButtonEnabled[this.assignedTaskDdetails._id] = true;
            new showAlertModal('Error', "error to archived selected task");
          }
        );
    }
    else {
      new showAlertModal("Error", "unable to archived selected task")
    }

  }

  fetchRecordsFor(tabName: string, existingRecords: State[]) {
    let status = null;
    let folder = null;
    let subStatus = null;

    if (!tabName || tabName == null || tabName.trim().length == 0) {
      return;
    } else if (tabName === this.TAB_ASSIGNED) {
      if (this.personalFetched) {
        return;
      } else {
        this.personalFetched = true;
        status = 'ACTIVE';
        folder = 'Personal';
      }
    } else if (tabName === this.TAB_UNASSIGNED) {
      if (this.groupFetched) {
        return;
      } else {
        this.groupFetched = true;
        status = 'ACTIVE';
        folder = 'Group';
      }
    } else if (tabName === this.TAB_FLAGGED) {
      if (this.flaggedFetched) {
        return;
      } else {
        this.flaggedFetched = true;
        subStatus = 'FLAGGED';
        status = 'CLOSED';
        folder = 'PERSONAL';
      }
    } else {
      return;
    }

    if (existingRecords == null) {
      existingRecords = [];
    }

    if (tabName == this.TAB_ASSIGNED || tabName == this.TAB_UNASSIGNED) {
      this.progressBarFlag = true;
      this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder(status, folder, 0, this.fetchRecords)
        .subscribe(states => {
          for (const state of states) {
            existingRecords.push(state);
          }

          if (tabName === this.TAB_ASSIGNED) {
            this.setFirstAssignedTaskValues(existingRecords);
            this.tempAssignedStates = JSON.parse(JSON.stringify(existingRecords));
          } else if (tabName === this.TAB_UNASSIGNED) {
            this.setFirstUnAssignedTaskValues(existingRecords);
          }

          // this.progressBarFlag = false;
        }, error => {
          this.progressBarFlag = false;
        });
    } else if (tabName == this.TAB_FLAGGED) {
      this.progressBarFlag = true;
      this.subscriptionGroup = this.stateService.getStatesBySubStatusAndFolder(subStatus, status, 0, this.fetchRecords, folder)
        .subscribe(states => {
          for (const state of states) {
            existingRecords.push(state);
          }

          if (tabName === this.TAB_FLAGGED) {
            this.setFirstFlaggedTaskValues(existingRecords);
          }

          // this.progressBarFlag = false;
        }, error => {
          this.progressBarFlag = false;
        });
    }
  }

  getDocuments(stateInstane: State) {
    if (Object.keys(this.documentsForState).length >0 && this.documentsForState[stateInstane._id]) {
      return this.documentsForState[stateInstane._id];
    }
    this.documentsForState[stateInstane._id] = [];
    this.stateService.getDocumentsForState(stateInstane)
      .subscribe(documents => {
          if (documents) {
            this.documentsForState[stateInstane._id] = documents;
            
          }
        },
        error => {
          // console.log("error in fetching documents ");
          // console.log(error);
        }
      )
  }

  isUploadedDocumentValid(document: Document, fileType: string) {
    if (document && document.allowedFileTypes && document.allowedFileTypes.length > 0) {
      for (let allowfileType of document.allowedFileTypes) {
        if (fileType.match(allowfileType)) {
          return true;
        }
      }
      return false
    }
    return true;
  }

  onDocumentUploadForTask(event, document: Document, state: State) {
    var documentName = document.documentName;
    if (document.documentName == null || document.documentName.trim().length == 0) {
      documentName = uuid();
      document.documentName = documentName;
    }
    const fileInputForm = new FormData();
    const file: File = event.target.files[0];
    if (!this.isUploadedDocumentValid(document, file.type)) {
      new showAlertModal("Error", document.documentType + " invalid file type");
    }
    fileInputForm.append('file', file, file.name);
    var uploadFileName = uuid();
    if (file.name.split(".").length >= 2) {
      uploadFileName = uploadFileName + "." + file.name.split(".")[file.name.split(".").length - 1];
    }
    fileInputForm.append("fileName", uploadFileName);
    fileInputForm.append("functionInstanceName", "FLOW");
    fileInputForm.append("entityType", state.machineType);
    fileInputForm.append("entityRef", state._id);
    fileInputForm.append("documentName", documentName);
    fileInputForm.append("stateInstanceId", state._id);
    document.userFileName = file.name;
    document.fileName = uploadFileName;
    document.uploadTime = new Date();
    this.documentsToBeUploaded.push(fileInputForm);
    
  }

  uploadDocumentForTask(state: State, tabType: string) {
    let numberOfDocs = this.documentsForState[state._id].length;
    for (let inputDoc of this.documentsToBeUploaded) {
      this.subscription = this.fileService.upload(inputDoc)
        .subscribe(
          response => {
            if (response && response["url"] && response["fileName"]) {
              for (let doc of this.documentsForState[state._id]) {
                if (doc.stateInstanceId == inputDoc.get("stateInstanceId") && doc.documentName == inputDoc.get("documentName")) {
                  doc.url = response["url"];
                  doc.fileName = inputDoc.get("fileName");
                  doc.downloadFileUrl = response["downloadFileUrl"];
                  doc.fullDataUrl = response["fullDataUrl"];
                  doc.fullFileUrl = response["fullFileUrl"];
                  
                }
              }
            }
            numberOfDocs--;
            if (numberOfDocs == 0) {
              if (tabType == this.TAB_ASSIGNED) {
                this.updateAssignedTask(state);
              }
            }
          })  
    }
    
  }

  validateDocuments(stateInstance: State) {
    if (stateInstance &&  this.documentsForState && this.documentsForState[stateInstance._id]) {
      for (let doc of this.documentsForState[stateInstance._id]) {
        if (doc.mandatory) {
          if(!doc.userFileName) {
            new showAlertModal('Error', doc.documentType + " is mandatory");
            return false;
          }
          if (!doc.status) {
            new showAlertModal('Error', doc.documentType + " status is mandatory");
            return false;
          }
        }
      }
    }
    return true;
  }

  onNewDocumentAdd(stateInstanace: State) {
    const newDoc = new Document();
    newDoc.stateInstanceId = stateInstanace._id;
    newDoc.flowInstanceId = stateInstanace.stateMachineInstanceModelId;
    newDoc.documentType = "OTHER";
    newDoc.documentName = uuid();
    if (!this.documentsForState[stateInstanace._id]) {
      this.documentsForState[stateInstanace._id] = [];
    }
    this.documentsForState[stateInstanace._id].push(newDoc);
  }

  onRemoveDocument(stateInstanace: State, document: Document) {
    if (stateInstanace && document && this.documentsForState && this.documentsForState[stateInstanace._id]) {
      let index = this.documentsForState[stateInstanace._id].indexOf(document)
      if (index != -1) {
        this.documentsForState[stateInstanace._id].splice(index, 1);
      }
    }
  }

  onDocumentDescriptionSelect(document: Document, selectedTab: string) {
    this.selectedDocument = JSON.parse(JSON.stringify(document));
    console.log(this.selectedDocument);
    this.selectedTab = selectedTab;
  }

  onSubmitDocumentDescription() {
    console.log("onsubmit");
    if (this.selectedTab == this.TAB_ASSIGNED) {
      for (let doc of this.documentsForState[this.assignedTaskDdetails._id]) {
        console.log(doc.documentName + " " + this.selectedDocument.documentName);
        if (doc && doc.documentName == this.selectedDocument.documentName) {
          doc.description = this.selectedDocument.description;
          //this.selectedDocument = null;
        }
      }
    }
  }

  onDownloadDocument(document: Document) {
    if (document && document.downloadFileUrl) {
      const redirectLink = environment.interfaceService + document.downloadFileUrl;
      window.open(
        redirectLink,
        '_blank' 
        );
    }
  }
}
