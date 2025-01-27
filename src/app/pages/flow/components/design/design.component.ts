declare var graphTools: any;
declare var saveStateObject: any;
declare var updateStateObject: any;
declare var designFlowEditor: any;
declare var closeModal: any;
declare var showModal: any;
declare var exportGraphXml: any;
declare var updateNewEdge: any;
declare var deleteNewEdge: any;
declare var updateStateTrigger: any;
declare var styleInfo: any;

import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { v4 as uuid } from 'uuid';

import {AllCommunityModules} from '@ag-grid-community/all-modules';

// import 'rxjs/add/operator/switchMap';

// Model Imports
import {
  GraphObject, DataPoint, Classifier, StateModel,
  EventModel, Expression, Transition, ManualAction, DataPointValidation, StateInfoModel, LabelValue, TaskValidation, DataPointAccess, DecisionTableHeader
} from '../../../../models/flow.model';
import { ConnectorConfig, ConnectorInfo, TaskObject, TempConnectorConfig } from '../../../../models/setup.model';
import { ApiConfig, ApiKeyExpressionMap, ApiResponse, MVELObject } from '../../../../models/setup.model';
import { CommonSearchModel } from '../../../../models/flow.model';

// Service Imports
import { GraphService, CommunicationService } from '../../../../services/flow.service';
import { StateService, DataCachingService } from '../../../../services/inbox.service';
import { ConnectorConfigService, FileService } from '../../../../services/setup.service';
import { environment } from '../../../../../environments/environment';
import { AlertService } from 'app/services/shared.service';
import { DataModelService } from '../../../../services/setup.service';
import { DataModel, Field, ValidatorInstance, ExtractorInstance, Entity } from '../../../../models/datamodel.model';
import { AgentService } from '../../../../services/agent.service';
import { Agent } from '../../../../models/agent.model';
import { MWRouteConfig } from 'app/models/mwroute.model';
import { MWRouteService } from 'app/services/mwroute.service';
@Component({
  selector: 'api-flow-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.scss'],
  providers: [ConnectorConfigService, FileService]
})

export class DesignComponent implements OnInit, OnDestroy {

  // Final strings used in html as method parameter
  ZOOM_IN = 'ZOOM_IN';
  ZOOM_OUT = 'ZOOM_OUT';
  ZOOM_ACTUAL = 'ZOOM_ACTUAL';
  PRINT_PREVIEW = 'PRINT_PREVIEW';
  POSTER_PRINT = 'POSTER_PRINT';

  // List counts
  dataPointCount: number = 0;
  stateCount: number = 0;

  // Dynamic html titles for dialogs
  stateCreateMode: boolean = true;
  updateStateFlag: boolean = true;

  // state types
  STATE_TYPE_AUTO  ="Auto";
  STATE_TYPE_MANUAL = "Manual";
  STATE_TYPE_COGNITIVE = "Cognitive";
  
  // Dropdown source list
  sourceStatusCodes: string[] = ['DRAFT', 'ACTIVE', 'ARCHIVE'];
  sourceStateTypes: string[] = ['Manual', 'Auto', 'Cognitive'];
  allocationTypes: string[] = ['Group', 'Least_Allocated', 'Maximum_Efficiency', 'API', 'User', 'Round_Robin', 'Auto_Agent_Allocation', 'Allocate_To_TeamLeader'];
  amountTypes: string[] = ['FIXED', 'DERIVED', 'API'];
  timerUnitType: string[] = ['MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'];
  sourceOperands: string[] = ['AND', 'OR'];
  sourceClassifiers: Classifier[] = [];
  autoSourceEntryActionList: string[] = [];
  manualSourceEntryActionList: string[] = [];
  sourceApiConfigList: ApiConfig[] = [];
  sourceConConfigList: ConnectorConfig[] = [];
  sourceManualActionType: string[] = ['STRING', 'BOOLEAN', 'NUMBER', 'SINGLE_SELECT', 'MULTI_SELECT'];
  sourceEvents: EventModel[] = [];
  sourceDataTypes: string[] = ['STRING', 'BOOLEAN', 'NUMBER', 'SINGLE_SELECT', 'MULTI_SELECT', 'ARRAY', 'TEXT', 'ANY'];
  sourceTimerUnitList: string[] = [];
  graphtypList = [null, "PIE_CHART", "BAR_GRAPH"];

  // Models to bind with html
  bulkEdit: boolean = false;
  readOnly: boolean;
  graphObject: GraphObject;
  tempGraphObject: GraphObject;
  tempState: StateModel;
  tempStateCd: string;
  tempParentState: StateModel;
  tempEvent: EventModel;
  tempEdgeEvent: EventModel;
  childStateEventMap: any;
  childStateList: string[];
  selectedEvent: EventModel;
  bulkExpressions: string = '';
  orPayload: any;
  stateInfoModels: StateInfoModel[];
  selectedModel: StateInfoModel;
  // Warning Modal properties
  warningHeader: string;
  warningBody: string;
  conInfoList: ConnectorInfo[] = [];
  connectorInfoList: ConnectorInfo[] = [];
  connectorList: ConnectorConfig[] = [];
  tempStateConnectorList: any = [];
  tempSelectedConnectorInfoList = {};
  tempSelectedConfigTypeTask = {};
  //connectors
  configList: any = [];
  typeConfigList: any = [];
  payloadList: any = [];
  apiConfig: ApiConfig;
  conConfig: ConnectorConfig;
  tempConConfig: ConnectorConfig;
  selectedConInfo: ConnectorInfo;
  selectedResponse: ApiResponse;
  responseTypeSource: string[];
  paramsToSelectSource: string[];
  conInfoOfNoMetadata: ConnectorInfo;
  gotConInfo: boolean = false;
  loadingConfigMap: boolean = false;
  temp: any;
  connectorNamesForOld = {};
  stateConnectorTaskConfig: ConnectorConfig[];
  stateTaskConfigFunctionInstanceMap = {};
  copyStateConnectorTaskConfig: ConnectorConfig[];
  toDeleteConfigList: string[];
  //file
  fileSelected: boolean;
  selectedFile: FormData;
  fileUploaded: boolean;
  fileUploadedUrl: string;
  fileName: string;

  progressBarFlag: boolean = false;
  selectedConfig: boolean = false;
  specificConfigSelected: boolean = false;

  //error
  errorToSaveGraphObject: string = null;

  //textEditor
  ruleKey: string = "";
  ruleValue: string = "";
  selectedRule: ApiKeyExpressionMap;
  previousExpression: string = "";
  selectedRuleInput: string = "";
  mvelObject: MVELObject;

  //Entity
  dataModelList:DataModel[];
  selectedEntity:DataModel;
  selectedDataModel:DataModel;
  selectedField:Field;
  entityselected:boolean;
  entityRedirectWarning:string;
  entityRedirect:boolean;

  //Routes
  mwRouteList: MWRouteConfig[];

  virtualAgentList:Agent[];
  selectedVirtualAgents:string[];

  dataPointAccessFilterQuery: string;

  private subscription: Subscription;
  private subscriptionEntryAction: Subscription;
  private subscriptionApiConfig: Subscription;
  private subscriptionOrPayload: Subscription;
  private subscriptionTimerUnit: Subscription;
  private subscriptionConConfig: Subscription;
  private agentSubscription: Subscription;
  private subscriptionFetchRoute: Subscription;


  // For Grid 
  // gridColumns:any[] = [{headerName: 'Result', headerExp: '', type: ['dateColumn', 'nonEditableColumn']}];
  gridApi:any;
  gridColumnApi:any;
  headerName:any ="";
  headerExp:any ="";
  decisionRequestType: string = "INPUT";
  decisionRequestTypes = [ "INPUT", "OUTPUT" ];
  private columnDefs:any[] = [];
  private rowData:any[]=[];
    private decisionTabelHeaders : DecisionTableHeader[];
    private decisionTabelRuleList: ApiKeyExpressionMap[][];

  public modules = AllCommunityModules;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private stateService: StateService,
    private graphService: GraphService,
    private communicationService: CommunicationService,
    private connectorConfigService: ConnectorConfigService,
    private fileService: FileService,
    private alertService: AlertService,
    private agentService: AgentService,
    private dataModelService: DataModelService,
    private mwRouteService: MWRouteService
  ) {
    window['flowComponentRef'] = { component: this, zone: zone };

    this.readOnly = this.communicationService.isReadOnly();
    if (this.readOnly) {
      this.communicationService.setReadOnly(false);
    }

    this.graphObject = this.communicationService.getGraphObject();
    if (this.graphObject) {
      this.communicationService.sendGraphObject(null);
    }
    this.selectedFile = new FormData();
    this.tempGraphObject = new GraphObject();
    this.tempState = new StateModel();
    this.tempStateCd = null;
    this.tempParentState = new StateModel();
    this.tempEvent = new EventModel();
    this.mvelObject = new MVELObject();
    this.apiConfig = new ApiConfig();
    this.tempConConfig = new ConnectorConfig();
    this.conConfig = new ConnectorConfig();
    this.conInfoOfNoMetadata = new ConnectorInfo();
    this.selectedRule = new ApiKeyExpressionMap();
    this.sourceClassifiers = [new Classifier(), new Classifier()];
    this.sourceApiConfigList = [];
    this.sourceConConfigList = [];
    this.stateConnectorTaskConfig = [];
    this.connectorNamesForOld = {};
    this.stateTaskConfigFunctionInstanceMap = {};
    this.tempStateConnectorList = [];
    this.toDeleteConfigList = [];
    this.temp = {};
    this.responseTypeSource = ['PAYLOAD', 'PARAM'];
    this.paramsToSelectSource = ['SELECTIVE', 'ALL'];
    //Entity
    this.selectedEntity = new DataModel();
    this.selectedDataModel = new DataModel();
    this.selectedField = new Field();
    this.dataModelList = [];
    this.entityselected = false;
    this.entityRedirectWarning = "You will be redirected to a different page, please make sure you save the process!!";
    this.entityRedirect = false;

    this.virtualAgentList = [];
    this.selectedVirtualAgents = [];
  }

  // #######################################################GRID
 
  onAddGridColumn() {
    if (!this.tempState.decisionTabelHeaders) {
      this.tempState.decisionTabelHeaders = [];
      //this.initDecisionTableHeaders();
    }
    let headerName = this.headerName.dataPointLabel;
    let field = this.headerName.dataPointName;
    var count = 1;
    for (let index = 0; index < this.columnDefs.length; index++) {
      const element = this.columnDefs[index];
      if(element.value === field){
        count++;
      }        
    }
    field = field + "-|-"+count;
    // return;

    if (this.decisionRequestType == "INPUT") {
      this.columnDefs.unshift({headerName: headerName, field:field, label: this.headerName.dataPointLabel, value:this.headerName.dataPointName,requestType:'INPUT',disabled:true, sortable: true, filter: true,editable: true});
    }
    else {
      this.columnDefs.push({headerName: headerName, field:field, label: this.headerName.dataPointLabel, value:this.headerName.dataPointName,requestType:'OUTPUT',disabled:true, sortable: true, filter: true,editable: true});
    }
    // this.gridApi.destroy();
    // this.gridApi.setDatasource(this.columnDefs);
    this.gridApi.setColumnDefs([]);
    this.gridApi.setColumnDefs(this.columnDefs);
    

    // let pos = this.columnDefs.map(element => element.value).indexOf(field);

    console.log(this.columnDefs)
  }
  addGridRow(){
    let newNode:any = {};
    for (var i=0; i<this.columnDefs.length;i++){
      var temp = this.columnDefs[i].field + "";
      newNode[temp] ="";
    }
    this.rowData.push(newNode);
    this.gridApi.setRowData([]);
    this.gridApi.setRowData(this.rowData);
  }
  removeGridSelected(){
    var selectedData =this.gridApi.getSelectedRows();
    var res = this.gridApi.updateRowData({remove: selectedData});
  }
  saveGridDate(){
    let struct:any[] =[];
    let exportCol:any[]=[];
    this.rowData.forEach(element => {
      let singleEntry = []
      for(var prop in element){
        let proparray  = prop.split("-|-");
        singleEntry.push({
          key: proparray[0],
          expression:element[prop]
        })
      }
      struct.push(singleEntry);
    });
    
    this.columnDefs.forEach(element => {
      var tempCols:DecisionTableHeader = new DecisionTableHeader();
      tempCols.label = element.label;  
      tempCols.value = element.value;  
      tempCols.requestType = element.requestType;  
      tempCols.disabled = element.disabled;
      exportCol.push(tempCols);
    });
    this.tempState.decisionTabelHeaders = exportCol;
    this.tempState.decisionTabelRuleList = struct;
  }
  onUploadGridCsv(event: {type: string, data: any}) {
    if (event.type === 'success') {
      event.data.forEach(element => {
        element['result'] = '';
      });
      // console.log(event.data);
      this.rowData = event.data;
      this.gridApi.setColumnDefs([]);
      this.gridApi.setColumnDefs(this.columnDefs);
      this.gridApi.refreshCells({force: true})
    } else { 
      console.log(event.data); // error
    }
  }
  onRemoveGridColumn(pos) {
    // let pos = this.tempState.decisionTabelHeaders.indexOf(decisionHeader);
    // if (pos != -1) {
      // this.tempState.decisionTabelHeaders.splice(pos, 1);
      if(this.columnDefs.length>1){
        this.columnDefs.splice(pos, 1);
        this.gridApi.setColumnDefs([]);
        this.gridApi.setColumnDefs(this.columnDefs);
      }
    // }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // data = createData(14);
    // topRowData = createData(2);
    // bottomRowData = createData(2);
    // params.api.setRowData(data);
    // params.api.setPinnedTopRowData(topRowData);
    // params.api.setPinnedBottomRowData(bottomRowData);
  }

  gridPopulate(){
    if (!this.tempState.decisionTabelRuleList || !this.tempState.decisionTabelRuleList || this.tempState.decisionTabelHeaders.length == 0 || this.tempState.decisionTabelRuleList.length == 0) {
      return;
    }

    this.columnDefs = [];
    this.rowData=[];
    
    let tempInput = JSON.parse(JSON.stringify(this.tempState.decisionTabelRuleList));

    for (let colIndex = 0; colIndex < this.tempState.decisionTabelHeaders.length; colIndex++) {
      const element = this.tempState.decisionTabelHeaders[colIndex];
      var temp= {};
      let field=element.value;
      var count = 1;
      for (let index = 0; index < this.columnDefs.length; index++) {
        const element = this.columnDefs[index];
        if(element.value === field){
          count++;
        }        
      }
      field = field + "-|-"+count;

      temp['headerName'] =element.label;
      temp['field'] =field;
      temp['label'] =element.label;
      temp['value'] =element.value;
      temp['requestType'] =element.requestType;
      temp['disabled'] =element.disabled;
      temp['sortable'] =true;
      temp['filter'] =true;
      temp['editable'] =true;
      this.columnDefs.push(temp);


      
      tempInput.forEach(element => {
        element[colIndex]['key'] = field;
      });
      
    }
    // console.log(this.columnDefs);
    
    for (let rowIndex = 0; rowIndex < tempInput.length; rowIndex++) {
      const element = tempInput[rowIndex];
      var innerRowTemp ={}
      element.forEach(el2 => {
        innerRowTemp[el2.key] = el2.expression;
      });
      this.rowData.push(innerRowTemp);
    }

  }
  resetGrid(){
    this.columnDefs = [];
    this.rowData = [];
    
    this.gridApi.setColumnDefs([]);
    this.gridApi.setRowData([]);

  }
  // #######################################################GRID END

  ngOnInit() {
    this.load();
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    window['flowComponentRef'] = null;

    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionEntryAction && !this.subscriptionEntryAction.closed) {
      this.subscriptionEntryAction.unsubscribe();
    }
    if (this.subscriptionApiConfig && !this.subscriptionApiConfig.closed) {
      this.subscriptionApiConfig.unsubscribe();
    }
    if (this.subscriptionTimerUnit && !this.subscriptionTimerUnit.closed) {
      this.subscriptionTimerUnit.unsubscribe();
    }
  }

  load(): void {
    this.getAutoSourceEntryActions();
    this.getManualSourceEntryActions();
    this.getTimerUnits();
    this.getApiConfigLookup();
    this.getConList();
    this.getDataModelList();
    this.fetchAgents();
    this.geRoutesLookup();
    var graphLoad = false;
    if (!this.graphObject || this.graphObject === null) {
      this.loadGraphObject();
      graphLoad = true;
    }
    else {
      this.loadGraphObject();
    }
    this.getAllConnectorInfos(graphLoad);
    

    //this.fetchStatesOrPayload();
  }

  loadGraphObject() {
    if (!this.graphObject || this.graphObject === null) {
      this.graphObject = new GraphObject();
      this.graphObject.statusCd = this.sourceStatusCodes[0],
        this.addNewDataPoint(true);
    }
    new designFlowEditor(this.graphObject.xml, this.readOnly);

  }

  fetchStatesOrPayload() {
    this.subscriptionOrPayload = this.stateService.getStatesByMachineType(this.graphObject.machineType)
      .subscribe(stateInfoModels => {
        if (stateInfoModels) {
          this.stateInfoModels = stateInfoModels;
          new styleInfo(this.stateInfoModels, "design");
        }
        else {
          this.stateInfoModels = null;
        }
      });

  }

  storeModel(model) {

    this.selectedModel = model;
  }

  
  getAutoSourceEntryActions() {
    this.subscriptionEntryAction = this.graphService.getEntryActions(this.STATE_TYPE_AUTO)
      .subscribe(
        entryActionList => {
          if (entryActionList) {
            this.autoSourceEntryActionList = entryActionList;
          }
        },
        error => {

        }
      )
  }

  getManualSourceEntryActions() {
    this.subscriptionEntryAction = this.graphService.getEntryActions(this.STATE_TYPE_MANUAL)
      .subscribe(
        entryActioList => {
          if(entryActioList) {
            this.manualSourceEntryActionList = entryActioList;
          }
        },
        error => {

        }
      )
  }

  getTimerUnits() {
    this.subscriptionTimerUnit = this.graphService.getTimerUnits()
      .subscribe(sourceTimerUnitList => {
        if (sourceTimerUnitList) {
          this.sourceTimerUnitList = sourceTimerUnitList;
        }
      });
  }


  getApiConfigLookup() {
    this.subscriptionApiConfig = this.graphService.apiConfigLookup()
      .subscribe(apiConfigList => {
        if (apiConfigList && apiConfigList.length > 0) {
          for (let api of apiConfigList) {
            if (!api.taskConConfigApi)
              this.sourceApiConfigList.push(api);
          }

        }
      });
  }

  geRoutesLookup() {
    this.subscriptionFetchRoute = this.mwRouteService.fetch().subscribe(
      result => {
          if (result && result.length > 0) {
              this.mwRouteList = result;
          }
      }, error => {

      }
  );
  }

  getAllConnectorInfos(graphLoad: boolean) {
    this.subscriptionConConfig = this.connectorConfigService.getConnecterInfo()
      .subscribe(
        infos => {
          this.connectorInfoList = infos;
          this.getAllConnectors(graphLoad);
        },
        error => {
          this.errorToSaveGraphObject = "unable to fetch connector infos";
          showModal("errorModel");
        }
      )
  }

  getAllConnectors(graphLoad: boolean) {
    this.subscriptionConConfig = this.connectorConfigService.getAllCons()
      .subscribe(
        connectors => {
          this.connectorList = connectors;
          this.removeOldTaskConfig();
          this.setTaskconfigsFromConnConfigs();

        },
        error => {
          this.errorToSaveGraphObject = "unable to fetch connectors";
          showModal("errorModel");
        }
      )
  }

  setTaskconfigsFromConnConfigs() {
    if (this.graphObject && this.graphObject.states) {
      for (let state of this.graphObject.states) {
        if (state && state.taskConfigList && state.taskConfigList.length > 0) {
          for (let taskId of state.taskConfigList) {
            for (let con of this.connectorList) {
              if (con.taskConfig) {
              }
              if (con.taskConfig && con.configName == taskId) {
                this.addTaskIdToStateTaskConfigFunctionInstanceMap(state, taskId);
                this.stateConnectorTaskConfig.push(JSON.parse(JSON.stringify(con)));
              }
            }
          }
        }

      }
    }


  }

  removeOldTaskConfig() {
    if (this.graphObject && this.graphObject.states) {
      var states: StateModel[] = [];
      for (let state of this.graphObject.states) {
        this.connectorNamesForOld[state.stateCd] = [];
        if (state && state.taskConfig && state.taskConfig.length > 0) {
          for (let con of state.taskConfig) {
            var configName = con.configName;
            if (configName == state.stateCd) {
              configName = uuid();
            }
            con.configName = configName;
            if (!state.connectorConfigList) {
              state.connectorConfigList = [];
            }
            var configTypeRefConName = this.getConfigTypeAndRefConNameForTaskConfigFromConnectors(con);
            if (configTypeRefConName != null && configTypeRefConName.configType != null && configTypeRefConName.refConName != null) {
              state.connectorConfigList.push(configTypeRefConName.refConName);
              con.configType = configTypeRefConName.configType;
              var functionInstanceNameConName = { functionInstanceName: con.functionInstanceName, connectorName: configTypeRefConName.refConName };
              this.connectorNamesForOld[state.stateCd].push(functionInstanceNameConName);
              this.addTaskIdToStateTaskConfigFunctionInstanceMap(state, con.configName);
              this.stateConnectorTaskConfig.push(JSON.parse(JSON.stringify(con)));


            }
          }


        }
        states.push(state);
      }
      this.graphObject.states = states;

    }
    var countInstatInstance = 0;
    for (let stin in this.stateTaskConfigFunctionInstanceMap) {
      countInstatInstance += 1;
    }
    for (let stateCd in this.stateTaskConfigFunctionInstanceMap) {
      for (let taskId of this.stateTaskConfigFunctionInstanceMap[stateCd]) {
        var found = false;
        for (let statetask of this.stateConnectorTaskConfig) {
          if (statetask.configName == taskId) {
            found = true;
          }
        }
        if (!found) {
          console.log("not found for task id " + taskId.toString());
        }
      }
    }

  }

  addTaskIdToStateTaskConfigFunctionInstanceMap(state: StateModel, taskId: string) {
    if (!this.stateTaskConfigFunctionInstanceMap) {
      this.stateTaskConfigFunctionInstanceMap = {};
    }
    if (!this.stateTaskConfigFunctionInstanceMap[state.stateCd]) {
      this.stateTaskConfigFunctionInstanceMap[state.stateCd] = [];
    }
    this.stateTaskConfigFunctionInstanceMap[state.stateCd].push(taskId);
  }

  updateStateCdInStateTaskConfigFunctionInstanceMap(oldStateCd: string, newStateCd: string) {
    if (this.stateTaskConfigFunctionInstanceMap) {
      for (let statCd in this.stateTaskConfigFunctionInstanceMap) {
        if (statCd == oldStateCd) {
          this.stateTaskConfigFunctionInstanceMap[newStateCd] = this.stateTaskConfigFunctionInstanceMap[statCd];
          this.stateTaskConfigFunctionInstanceMap[statCd] = [];
        }
      }
    }
  }

  removeOldStateTaskconfig(state: StateModel) {
    state.taskConfig = [];
    state.connectorConfig = [];
    if (!state.connectorConfigList) {
      state.connectorConfigList = [];
    }
    if (state.connectorConfigList.length == 0 && this.connectorNamesForOld && this.connectorNamesForOld[state.stateCd]) {
      for (let funcon of this.connectorNamesForOld[state.stateCd]) {
        if (funcon.connectorName) {
          state.connectorConfigList.push(funcon.connectorName);
        }
      }
    }
  }

  addToTaskIdToTempStateTaskConfig(taskId: string) {
    if (!this.tempState.taskConfigList || this.tempState.taskConfigList.length == 0) {
      this.tempState.taskConfigList = [];
    }
    for (let tid of this.tempState.taskConfigList) {
      if (taskId == tid) {
        return;
      }
    }
    this.tempState.taskConfigList.push(taskId);
  }

  setTaskConfigFromOldConfigForState() {
    for (let connectorName of this.tempState.connectorConfigList) {
      if (this.connectorNamesForOld && this.connectorNamesForOld[this.tempState.stateCd] && this.connectorNamesForOld[this.tempState.stateCd].length > 0) {
        for (let funConName of this.connectorNamesForOld[this.tempState.stateCd]) {
          if (funConName.connectorName == connectorName) {
            for (let sttaskconfig of this.stateConnectorTaskConfig) {
              if (sttaskconfig.functionInstanceName == funConName.functionInstanceName) {
                for (let conInfo of this.connectorInfoList) {
                  if (conInfo.type == sttaskconfig.configType) {
                    this.addToTempStateTaskConfig(sttaskconfig, conInfo, connectorName);
                    this.addToTaskIdToTempStateTaskConfig(sttaskconfig.functionInstanceName);
                    this.tempSelectedConfigTypeTask[connectorName] = conInfo.type;

                  }
                }

              }
            }
          }
        }
      }
    }

  }

  getRefConConfigName(taskConfig) {
    return taskConfig.connectorConfRefName.replace(/ /g, "_");
  }

  getDisplyConConfigName(taskConfig) {
    return taskConfig.connectorConfRefName;
  }

  getConList() {
    this.subscriptionConConfig = this.connectorConfigService.getAllCons()
      .subscribe(conConfigList => {
        if (conConfigList) {
          for (let con of conConfigList) {
            if (!con.taskConfig && con.configName) {
              this.sourceConConfigList.push(con)
            }
          }
        }
      });
  }

  prepareDummyObject() {
    if (this.graphObject) {
      if (this.graphObject.entity) {
        this.entityselected = true;
      }
      this.tempGraphObject = JSON.parse(JSON.stringify(this.graphObject));
      
    } else {
      this.tempGraphObject = new GraphObject();
    }
  }

  toolsChoice(choice: string): void {
    new graphTools(choice);
  }

  addState(sourceEvents: EventModel[]): void {
    this.resetGrid();
    this.stateCreateMode = true;
    this.selectedConfig = false;
    this.specificConfigSelected = false;
    this.configList = [];
    this.payloadList = [];
    this.conConfig.taskObject = new TaskObject();

    this.sourceEvents = sourceEvents;

    this.tempState = new StateModel();
    this.tempState.type = this.sourceStateTypes[0];
    this.tempState.allocationModel.allocationType = this.allocationTypes[0];

    if (this.sourceEvents && this.sourceEvents.length > 0) {
      this.tempState.trigger = this.sourceEvents[0];
      this.tempState.initialState = false;
    } else {
      this.tempState.trigger = null;
      this.tempState.initialState = true;
    }
    this.tempStateConnectorList = [];
    this.tempSelectedConfigTypeTask = {};
    this.tempSelectedConnectorInfoList = {};
    if (this.tempState.type == "Manual") {
      this.addDataPointAccess();
    }
  }

  onStateTypeSelect(event) {
    if (this.tempState && this.tempState.type != null && this.tempState.type == "Manual") {
      if (this.tempState.dataPointAccessList == null || this.tempState.dataPointAccessList.length == 0) {
        this.addDataPointAccess();
      }
    }
  }

  addDataPointAccess() {
    if (this.tempState != null && this.graphObject.dataPointConfigurationList != null && this.graphObject.dataPointConfigurationList.length > 0) {
      if (this.tempState.dataPointAccessList == null) {
        this.tempState.dataPointAccessList = [];
      }
      for(let dataPoint of this.graphObject.dataPointConfigurationList) {
        this.tempState.dataPointAccessList.push(new DataPointAccess(dataPoint.dataPointName, dataPoint.dataPointLabel));
      }
    }
  }

  updateDataPointAccess() {
    if (this.tempState != null && (this.tempState.dataPointAccessList == null || this.tempState.dataPointAccessList.length == 0 )) {
      this.addDataPointAccess();
    }
    else {

    }
  }

  updateState(state: StateModel): void {
    this.tempStateConnectorList = [];
    this.tempSelectedConfigTypeTask = {};
    this.tempSelectedConnectorInfoList = {};
    this.removeOldStateTaskconfig(state);
    this.stateCreateMode = false;
    // this.specificConfigSelected = false;
    // this.selectedConfig = false;
    // this.gotConInfo = false;
    this.tempState = JSON.parse(JSON.stringify(state));
    this.tempStateCd = JSON.parse(JSON.stringify(this.tempState.stateCd));
    //this.setPreviousConnectorTaskList();
    this.setTaskConfigFromOldConfigForState()
    this.setConnectorTaskConfig();
    this.gridPopulate();
    // if(this.tempState.connectorConfig){
    //   if(this.tempState.connectorConfig.length > 0){
    //     this.onConfigSelect(this.tempState.connectorConfig);
    //   }
    // }
    this.updateDataPointAccess();

  }

  setPreviousConnectorTaskList() {

    if (this.tempState.taskConfig) {
      for (let taskConfig of this.tempState.taskConfig) {
        if (this.connectorList) {
          for (let con of this.connectorList) {
            if (taskConfig.connectorConfigRef && con.functionInstanceName && taskConfig.connectorConfigRef == con.functionInstanceName) {
              if (!this.tempState.connectorConfigList) {
                this.tempState.connectorConfigList = [];
              }
              this.tempState.connectorConfigList.push(con.configName);
            }
          }
        }


      }
      this.tempState.taskConfig = [];
      this.tempState.connectorConfig = [];
    }
  }


  addEdge(sourceEvents: EventModel[]) {
    if (sourceEvents && sourceEvents.length > 0) {
      this.sourceEvents = sourceEvents;
      this.tempEdgeEvent = this.sourceEvents[0];
    } else {
      this.sourceEvents = [];
    }
  }

  saveEdge() {
    new updateNewEdge(this.tempEdgeEvent);
  }

  deleteEdge() {
    new deleteNewEdge();
  }

  eventsMismatch(state: StateModel, newEvents: EventModel[], childStateList: string[], modalHeader: string, modalBody: string) {
    this.warningHeader = modalHeader;
    this.warningBody = modalBody;

    this.tempState = state;
    this.sourceEvents = newEvents;
    this.childStateList = childStateList;
    this.childStateEventMap = {};

    for (const stateCd of childStateList) {
      if (stateCd) {
        this.childStateEventMap[stateCd] = null;
      }
    }
  }

  updateStateTriggers() {
    new updateStateTrigger(this.childStateEventMap, this.tempState);
  }

  addEvent(): void {
    const tempEvent: EventModel = new EventModel();
    tempEvent.eventCd = null;
    tempEvent.operand = this.sourceOperands[0];
    tempEvent.expressionList = [];

    this.addExpression(tempEvent);

    this.tempState.events.push(tempEvent);
  }

  addExpression(event: EventModel): void {
    const tempExpression: Expression = new Expression();
    tempExpression.value = null;

    event.expressionList.push(tempExpression);
  }

  deleteExpression(expression: Expression, event: EventModel): void {
    const index = event.expressionList.indexOf(expression);
    event.expressionList.splice(index, 1);
  }

  deleteEvent(event: EventModel): void {
    const index = this.tempState.events.indexOf(event);
    this.tempState.events.splice(index, 1);
  }

  saveEvent(): void {
    this.tempState.events.push(this.tempEvent);
  }

  saveConConfig(): void {
    if (this.specificConfigSelected) {
      this.savetaskConfig()
    }
    else {
      this.saveState()
    }
  }

  saveConnectorTaskConfig() {
    if (!this.isStateConnectorCompatible) {
      return;
    }
    var tempTaskConfigs = []
    this.tempState.taskConfigList = [];
    if (this.tempStateConnectorList && this.tempStateConnectorList.length > 0) {
      this.tempState.connectorConfig = [];
      for (let configName of this.tempState.connectorConfigList) {
        for (let tmpTskCon of this.tempStateConnectorList) {
          if (tmpTskCon.connectorConfRefName == configName) {
            if (tmpTskCon._id == null) {
            }
            tempTaskConfigs.push(tmpTskCon);
            this.tempState.taskConfigList.push(tmpTskCon.configName);
          }
        }
      }
    }
    if (tempTaskConfigs.length > 0) {
      this.addToStateTaskconfigList(tempTaskConfigs);
    }
    if (this.tempState && this.stateTaskConfigFunctionInstanceMap) {
      this.stateTaskConfigFunctionInstanceMap[this.tempState.stateCd] = []
      for (let taskId of this.tempState.taskConfigList) {
        this.addTaskIdToStateTaskConfigFunctionInstanceMap(this.tempState, taskId);
      }
    }
    this.tempStateConnectorList = [];
    //console.log(this.tempState);;
  }

  saveState(): void {

    console.log("caloumnDef==> ");
    let gridObject = this.saveGridDate();
    console.log(gridObject);
    this.tempState.endState = (this.tempState.events.length === 0);
    if (this.tempState.stateCd == null || this.tempState.stateCd.trim().length == 0) {
      this.errorToSaveGraphObject = "state code can not be empty";
      showModal("errorModel");
      return;
    }
    if (this.tempState.stateCd != this.tempStateCd) {
      this.updateStateCdInStateTaskConfigFunctionInstanceMap(this.tempStateCd, this.tempState.stateCd);
    }
    this.tempStateCd = null;
    if (!this.isStateApiCompatible()) {
      this.tempState.apiConfigurationList = [];
    }

    if (!this.isStateRuleCompatible()) {
      this.tempState.ruleList = [];
    }

    if (!this.isStateConnectorCompatible()) {
      this.tempState.connectorConfig = [];
      this.tempState.taskConfig = [];
    }

    if (this.isStateConverseCompatible()) {
      if (this.selectedVirtualAgents.length > 0) {
        this.tempState.virtualAgentId = this.selectedVirtualAgents[0];
      }
      
    }
    
    if (this.isStateConnectorCompatible() && this.tempState.connectorConfigList && this.tempState.taskConfigList && this.tempState.connectorConfigList.length > 0) {
      this.saveConnectorTaskConfig();
    }
    else {
      this.tempState.connectorConfigList = [];
      this.tempState.taskConfigList = [];
    }


    if (this.tempState.stateId && this.tempState.stateId.toString().trim().length > 0) {
      const customObject: Object = JSON.parse(JSON.stringify(this.tempState));  // Very important line of code, don't remove
      new updateStateObject(customObject);
    } else {
      const newState = JSON.parse(JSON.stringify(this.tempState));
      this.stateCount++;
      newState.stateId = 'state' + this.stateCount;
      const customObject: Object = JSON.parse(JSON.stringify(newState));  // Very important line of code, don't remove
      new saveStateObject(customObject);

    }
  }

  save(): void {
    this.graphObject = this.tempGraphObject;
  }

  saveOnServer() {
    // This will call a method in app.js and it will convert mxGraph into xml
    // and send it back to this component in method saveGraphXml(xml: string)
    new exportGraphXml();
  }

  addNewDataPoint(isInit?: boolean) {
    this.dataPointCount++;

    const dataPoint: DataPoint = new DataPoint();
    dataPoint.dataPointName = 'Data Point' + this.dataPointCount;

    if (isInit) {
      this.graphObject.dataPointConfigurationList.push(dataPoint);
    } else {
      this.tempGraphObject.dataPointConfigurationList.push(dataPoint);
    }
  }

  deleteDataPoint(dataPoint: DataPoint) {
    const index = this.tempGraphObject.dataPointConfigurationList.indexOf(dataPoint);
    this.tempGraphObject.dataPointConfigurationList.splice(index, 1);
  }

  addDataPointValidation(dataPoint: DataPoint) {
    const validation = new DataPointValidation();
    dataPoint.validations.push(validation);
  }

  removeDataPointValidation(validation: DataPointValidation, dataPoint: DataPoint) {
    const index = dataPoint.validations.indexOf(validation);
    dataPoint.validations.splice(index, 1);
  }

  isStateApiCompatible() {
    // TODO: improve the mechanism to differentiate API State with other states
    return this.tempState && this.tempState.entryActionList && this.tempState.entryActionList.length > 0
      && this.tempState.entryActionList.includes('APIStateEntryAction');
  }

  isStateRuleCompatible() {
    // TODO: improve the mechanism to differentiate Rule State with other states
    return this.tempState && this.tempState.entryActionList && this.tempState.entryActionList.length > 0
      && this.tempState.entryActionList.includes('RuleStateEntryAction');
  }

  isStateConnectorCompatible() {
    // TODO: improve the mechanism to differentiate Rule State with other states
    return this.tempState && this.tempState.entryActionList && this.tempState.entryActionList.length > 0
      && this.tempState.entryActionList.includes('ConnectorStateEntryAction');
  }

  isStateConverseCompatible() {
    // TODO: improve the mechanism to differentiate Rule State with other states
    return this.tempState && this.tempState.entryActionList && this.tempState.entryActionList.length > 0
      && this.tempState.entryActionList.includes('ConverseStateEntryAction');
  }
  isStateRouteCompatible() {
    // TODO: improve the mechanism to differentiate Rule State with other states
    return this.tempState && this.tempState.entryActionList && this.tempState.entryActionList.length > 0
      && this.tempState.entryActionList.includes('RouteStateEntryAction');
  }

  addRule() {
    if (!this.tempState) {
      this.tempState = new StateModel();
    }
    if (!this.tempState.ruleList) {
      this.tempState.ruleList = [];
    }

    this.tempState.ruleList.push(new ApiKeyExpressionMap());
  }

  removeRule(rule: ApiKeyExpressionMap) {
    if (rule && this.tempState && this.tempState.ruleList && this.tempState.ruleList.includes(rule)) {
      const index = this.tempState.ruleList.indexOf(rule);
      this.tempState.ruleList.splice(index, 1);
    }
  }

  addManualAction() {
    if (!this.tempState) {
      this.tempState = new StateModel();
    }
    if (!this.tempState.manualActions) {
      this.tempState.manualActions = [];
    }

    this.tempState.manualActions.push(new ManualAction());
  }

  removeManualAction(manualAction: ManualAction) {
    if (manualAction && this.tempState && this.tempState.manualActions && this.tempState.manualActions.includes(manualAction)) {
      const index = this.tempState.manualActions.indexOf(manualAction);
      this.tempState.manualActions.splice(index, 1);
    }
  }

  saveGraphXml(xml: string, states: StateModel[], transitions: Transition[]): void {
    if (xml && this.graphObject) {
      this.graphObject.xml = xml;
      this.graphObject.states = states;
      this.graphObject.transitions = transitions;

      this.graphObject.dataPointConfigurationList = this.graphObject.dataPointConfigurationList.sort((dp1, dp2) => {
        if (dp1.sequence > dp2.sequence) {
          return 1;
        } else if (dp1.sequence < dp2.sequence) {
          return -1;
        } else {
          return 0;
        }
      });

      for (const dataPoint of this.graphObject.dataPointConfigurationList) {
        dataPoint.validations = dataPoint.validations.sort((v1, v2) => {
          if (v1.sequence > v2.sequence) {
            return 1;
          } else if (v1.sequence < v2.sequence) {
            return -1;
          } else {
            return 0;
          }
        });

        if (dataPoint.dataType !== 'SINGLE_SELECT' && dataPoint.dataType !== 'MULTI_SELECT') {
          dataPoint.inputSource = [];
        }

        for (const validation of dataPoint.validations) {
          validation.dataPointKey = dataPoint.dataPointName;
        }
      }
      this.removeStateConnectorTaskConfig();
      if (this.stateConnectorTaskConfig && this.stateConnectorTaskConfig.length > 0) {
        this.saveStateconnectorConfigurations();
      }
      else {
        this.saveGraphObject();
      }

    }
  }

  getConfigTypeAndRefConNameForTaskConfigFromConnectors(taskConfig) {
    var result = { refConName: null, configType: null }
    for (let con of this.connectorList) {
      if (con.functionInstanceName == taskConfig.connectorConfigRef) {
        for (let conInfo of this.connectorInfoList) {
          if (conInfo.referenceType == con.configType && taskConfig.configType == conInfo.type) {
            result.refConName = con.configName;
            result.configType = conInfo.type;
            return result;
          }
        }
      }
    }
    return null;
  }



  saveGraphObject() {
    this.subscription = this.graphService.save(this.graphObject)
      .subscribe(graphObject => {
        this.graphObject = graphObject;
        this.deleteTaskConfig();
        this.alertService.success('Graph saved successfully!', false, 2000);
        
        //this.router.navigate(['/pg/flw/flsr'], { relativeTo: this.route });
      });
  }

  getConnectorNameFromTaskId(taskId: string) {
    for (let stattask of this.stateConnectorTaskConfig) {
      if (stattask.configName == taskId) {
        for (let con of this.connectorList) {
          if (!con.taskConfig && con.functionInstanceName == stattask.connectorConfigRef) {
            return con.configName;
          }
        }
      }
    }
    return null;
  }

  updateOldStateTaskConfig() {
    if (this.graphObject && this.graphObject.states) {
      var foundtaskconfig = false;
      for (let state of this.graphObject.states) {
        if (state.taskConfig && state.taskConfig.length > 0) {
          foundtaskconfig = true;
        }
      }
      for (let state of this.graphObject.states) {
        var taskconfigs = [];
        this.tempStateConnectorList = [];
        if ((state.taskConfig && state.taskConfig.length > 0) || (state.connectorConfig && state.connectorConfig.length > 0)) {
          for (let stateCd in this.stateTaskConfigFunctionInstanceMap) {
            if (stateCd == state.stateCd && this.stateTaskConfigFunctionInstanceMap[stateCd] && this.stateTaskConfigFunctionInstanceMap[stateCd].length > 0) {
              state.taskConfigList = [];
              state.connectorConfigList = [];
              var connectorName = null;
              for (let taskConfigName of this.stateTaskConfigFunctionInstanceMap[stateCd]) {
                for (let stattask of this.stateConnectorTaskConfig) {
                  if (stattask.configName == taskConfigName) {
                    for (let con of this.connectorList) {
                      if (!con.taskConfig && con.functionInstanceName == stattask.connectorConfigRef) {
                        connectorName = con.configName;
                        for (let conInfo of this.connectorInfoList) {
                          if (conInfo.referenceType == stattask.configType) {
                            this.addToTempStateTaskConfig(stattask, conInfo, connectorName);

                          }
                        }

                      }
                    }
                  }
                }
                if (connectorName != null) {
                  state.taskConfigList.push(taskConfigName);
                  state.connectorConfigList.push(connectorName);
                  state.taskConfig = [];
                  state.connectorConfig = [];
                  taskconfigs.push()
                }
              }
            }
          }
        }
        if (foundtaskconfig) {
          state.taskConfig = [];
          state.connectorConfig = [];
          if (!state.taskConfigList) {
            state.taskConfigList = [];
          }
          if (!state.connectorConfigList) {
            state.connectorConfigList = [];
          }
          this.tempState = JSON.parse(JSON.stringify(state));
          this.saveState();
        }
      }
    }
  }

  saveStateconnectorConfigurations() {
    var responseCount = 0;
    this.copyStateConnectorTaskConfig = JSON.parse(JSON.stringify(this.stateConnectorTaskConfig));
    //this.updateOldStateTaskConfig();
    for (let stateConTaskconfig of this.stateConnectorTaskConfig) {
      var errorFound = false;
      if (stateConTaskconfig._id != null) {
        this.subscriptionConConfig = this.connectorConfigService.updateConConfig(stateConTaskconfig)
          .subscribe(
            response => {
              responseCount += 1;
              const index = this.stateConnectorTaskConfig.indexOf(stateConTaskconfig);
              stateConTaskconfig = response;
              this.stateConnectorTaskConfig.splice(index, 1, stateConTaskconfig);
              if (responseCount == this.stateConnectorTaskConfig.length) {
                this.saveGraphObject();
              }
            },
            error => {
              this.alertService.error(error["error"]["message"], false, 2000);
              errorFound = true;
            }
          )
      }
      else {
        this.subscriptionConConfig = this.connectorConfigService.createConConfig(stateConTaskconfig)
          .subscribe(
            response => {
              responseCount += 1;
              const index = this.stateConnectorTaskConfig.indexOf(stateConTaskconfig);
              stateConTaskconfig = response;
              this.stateConnectorTaskConfig.splice(index, 1, stateConTaskconfig);
              if (responseCount == this.stateConnectorTaskConfig.length) {
                this.saveGraphObject();
              }
            },
            error => {
              this.alertService.error(error["error"]["message"], false, 2000);
              errorFound = true;
            }
          )
      }
    }

  }

  discardChanges(): void {
    this.router.navigate(['/pg/flw/flsr'], { relativeTo: this.route });
  }

  deepCopy(object: Object) {
    return JSON.parse(JSON.stringify(object));
  }

  enableBulkEdit(selectedEvent: EventModel) {
    if (this.bulkEdit) {
      return;
    }
    this.bulkEdit = true;
    this.selectedEvent = selectedEvent;
    this.bulkExpressions = '';

    if (this.selectedEvent && this.selectedEvent.expressionList && this.selectedEvent.expressionList.length > 0) {
      for (let index = 0; index < this.selectedEvent.expressionList.length; index++) {
        this.bulkExpressions += this.selectedEvent.expressionList[index].value;

        if (index < this.selectedEvent.expressionList.length - 1) {
          this.bulkExpressions += '\n';
        }
      }
    }
  }

  disableBulkEdit() {
    if (!this.bulkEdit) {
      return;
    }

    this.bulkEdit = false;
    this.selectedEvent.expressionList = [];

    if (this.bulkExpressions && this.bulkExpressions.trim().length > 0) {
      for (const expression of this.bulkExpressions.split('\n')) {
        this.selectedEvent.expressionList.push(new Expression(expression));
      }
    } else {
      this.addExpression(this.selectedEvent);
    }

    this.selectedEvent = null;
    this.bulkExpressions = '';
  }

  removeFromTempStateTaskConfig() {
    this.tempStateConnectorList = [];
    // for(let configName of this.tempState.connectorConfigList) {
    //   for(let tempConTaskconfig of this.tempStateConnectorList) {
    //     if (configName == tempConTaskconfig.configName) {
    //       const index = this.configList.indexOf(tempConTaskconfig);
    //       this.tempStateConnectorList.splice(index, 1);
    //     }
    //   }
    // }
  }

  addConfigParamToTask(configMaps) {
    var configMap = this.getConfigMap();
    configMap.type = "string";
    configMaps.push(configMap);
  }

  removeConfigParamFromTask(configMaps, config) {
    const index = configMaps.indexOf(config);
    if (index != -1) {
      configMaps.splice(index, 1);
    }
  }

  addBodyToTask(taskObjectBody) {
    var body = { key: null, value: null };
    taskObjectBody.push(body);
  }

  removeBodyFromTask(taskObjectBody, body) {
    const index = taskObjectBody.indexOf(body);
    if (index != -1) {
      taskObjectBody.splice(index, 1);
    }
  }



  addResponseExpressionToTask(response?: ApiResponse) {
    if (response) {
      response.keyExpressionList.push(new ApiKeyExpressionMap());
    }
  }

  removeResponseExpressionFromTask(response: ApiResponse, expression: ApiKeyExpressionMap) {
    if (response.keyExpressionList && response.keyExpressionList.length > 0) {
      const index = response.keyExpressionList.indexOf(expression);
      if (index != -1) {
        response.keyExpressionList.splice(index, 1);
      }
    }
  }



  addResponseToTask(responseList, response?: ApiResponse) {
    let newResponse = null;
    if (response) {
      newResponse = response;
    } else {
      newResponse = new ApiResponse(this.responseTypeSource[0], this.paramsToSelectSource[0]);
    }

    if (newResponse.keyExpressionList && newResponse.keyExpressionList.length === 0) {
      this.addResponseExpression(newResponse);
    }
    responseList.push(newResponse);
  }

  removeResponseFromTask(responseList, response) {
    const index = responseList.indexOf(response);
    if (index != -1) {
      responseList.splice(index, 1);
    }
  }

  cloneResponseForTaskConfig(responseList, response) {
    if (response) {
      const clonedResponse = JSON.parse(JSON.stringify(response));
      this.addResponseToTask(responseList, clonedResponse);
    }
  }

  getConfigMap() {
    return { key: null, value: null, type: "string", mandatory: false, validationExpr: null, valueList: null, fileName: null };
  }

  addToTempStateTaskConfig(taskConfig: ConnectorConfig, conInfo: ConnectorInfo, connectorName: string) {
    for (let stTaskConfig of this.tempStateConnectorList) {
      if (stTaskConfig.connectorConfRefName == connectorName) {
        return;
      }
    }
    const tempConTaskconfig = this.convertStateTaskConfigToTempTaskconfig(taskConfig, conInfo, connectorName);
    this.tempStateConnectorList.push(tempConTaskconfig);
    if (!this.tempState.taskConfigList || this.tempState.taskConfigList.length == 0) {
      this.tempState.taskConfigList = [];
    }
    this.tempState.taskConfigList.push(tempConTaskconfig.functionInstanceName);

  }

  convertStateTaskConfigToTempTaskconfig(taskConfig: ConnectorConfig, conInfo: ConnectorInfo, connectorName: string) {
   
    var tempConTaskconfig = new TempConnectorConfig();
    tempConTaskconfig._id = taskConfig._id;
    tempConTaskconfig.statusCd = taskConfig.statusCd;
    tempConTaskconfig.subStatus = taskConfig.subStatus;
    tempConTaskconfig.configName = taskConfig.configName;
    tempConTaskconfig.configType = taskConfig.configType;
    tempConTaskconfig.connectorInfoRef = taskConfig.connectorInfoRef;
    tempConTaskconfig.connectorConfigRef = taskConfig.connectorConfigRef;
    tempConTaskconfig.connectorConfRefName = connectorName;
    tempConTaskconfig.functionInstanceName = taskConfig.functionInstanceName;
    tempConTaskconfig.taskConfig = true;
    if (taskConfig.configMap && Object.keys(taskConfig.configMap).length > 0) {
      for (let configKey in taskConfig.configMap) {
        var configMap = this.getConfigMap();
        if (conInfo && conInfo.taskConfigAttributeList) {
          for (let task of conInfo.taskConfigAttributeList) {
            if (configKey == task.key) {
              configMap.type = task.type;
              configMap.mandatory = task.mandatory;
              configMap.validationExpr = task.validationExpr;
              configMap.valueList = task.valueList;

            }
          }
        }
        configMap.key = configKey;
        configMap.value = taskConfig.configMap[configKey];
        if (configMap.type == "file" && configMap.value) {
          configMap.fileName = configMap.value.split("/")[configMap.value.split("/").length - 1]
        }
        tempConTaskconfig.configMap.push(configMap);

      }
    }
    else{
      if (conInfo && conInfo.taskConfigAttributeList) {
        for (let task of conInfo.taskConfigAttributeList) {
          var configMap = this.getConfigMap();
            configMap.type = task.type;
            configMap.mandatory = task.mandatory;
            configMap.validationExpr = task.validationExpr;
            configMap.valueList = task.valueList;
            configMap.key = task.key;
            if (configMap.type == "file" && configMap.value) {
              configMap.fileName = configMap.value.split("/")[configMap.value.split("/").length - 1]
            }
            tempConTaskconfig.configMap.push(configMap);
        }
      }
    }
    if (!taskConfig.taskObject) {
      tempConTaskconfig.taskObjectBody = [];
      tempConTaskconfig.taskObjectResponseList = [];
    }
    if (taskConfig.taskObject && taskConfig.taskObject.body) {
      for (let bodyKey in taskConfig.taskObject.body) {
        var body = { key: null, value: null };
        body.key = bodyKey;
        body.value = taskConfig.taskObject.body[bodyKey];
        tempConTaskconfig.taskObjectBody.push(body);
      }
    }
    else {
      var t = { key: null, value: null }
      tempConTaskconfig.taskObjectBody.push(t);
    }
    if (taskConfig && taskConfig.taskObject.responseList && taskConfig.taskObject.responseList.length > 0) {
      tempConTaskconfig.taskObjectResponseList = taskConfig.taskObject.responseList;
    }
    else {
      this.addResponseToTask(tempConTaskconfig.taskObjectResponseList);
    }
    return tempConTaskconfig;
  }

  convertTempStateTaskConfigToTaskConfig(tempConTaskconfig: TempConnectorConfig) {
    if (tempConTaskconfig) {
      const taskConfig = new ConnectorConfig();
      taskConfig._id = tempConTaskconfig._id;
      taskConfig.statusCd = tempConTaskconfig.statusCd;
      taskConfig.subStatus = tempConTaskconfig.subStatus;
      taskConfig.configName = tempConTaskconfig.configName;
      taskConfig.configType = tempConTaskconfig.configType;
      taskConfig.connectorInfoRef = tempConTaskconfig.connectorInfoRef;
      taskConfig.connectorConfigRef = tempConTaskconfig.connectorConfigRef;
      taskConfig.functionInstanceName = tempConTaskconfig.functionInstanceName;
      taskConfig.taskConfig = true;
      if (tempConTaskconfig.configMap && tempConTaskconfig.configMap.length > 0) {
        taskConfig.configMap = {};
        for (let configMap of tempConTaskconfig.configMap) {
          taskConfig.configMap[configMap.key] = configMap.value;
        }

      }
      taskConfig.taskObject = new TaskObject();
      if (tempConTaskconfig.taskObjectBody && tempConTaskconfig.taskObjectBody.length > 0) {
        taskConfig.taskObject.body = {};
        for (let body of tempConTaskconfig.taskObjectBody) {
          taskConfig.taskObject.body[body.key] = body.value;
        }

      }
      if (tempConTaskconfig.taskObjectResponseList.length > 0) {
        var apiresponses = [];
        for (let apiresponse of tempConTaskconfig.taskObjectResponseList) {
          if (typeof apiresponse.responseCode == 'string') {
            apiresponse.responseCode = parseInt(apiresponse.responseCode)
          }
          apiresponses.push(apiresponse);
        }

        taskConfig.taskObject.responseList = apiresponses;
      }

      return taskConfig;
    }
    return null;
  }

  addToStateTaskconfigList(tempTaskConfigList: TempConnectorConfig[]) {
    for (let tempTaskconfig of tempTaskConfigList) {
      const taskconfig = this.convertTempStateTaskConfigToTaskConfig(tempTaskconfig);
      if (taskconfig) {
        var alreadyExist = false;
        for (let stateTaskConfig of this.stateConnectorTaskConfig) {
          if (stateTaskConfig._id) {
            if (stateTaskConfig._id != null && stateTaskConfig._id == taskconfig._id) {
              var index = this.stateConnectorTaskConfig.indexOf(stateTaskConfig);
              if (index != -1) {
                this.stateConnectorTaskConfig.splice(index, 1);
              }
              this.stateConnectorTaskConfig.push(JSON.parse(JSON.stringify(taskconfig)));
              alreadyExist = true;
            }
          }
          else {
            if (stateTaskConfig.configName != null && stateTaskConfig.configName == taskconfig.configName) {
              var index = this.stateConnectorTaskConfig.indexOf(stateTaskConfig);
              if (index != -1) {
                this.stateConnectorTaskConfig.splice(index, 1);
              }
              this.stateConnectorTaskConfig.push(JSON.parse(JSON.stringify(taskconfig)));
              alreadyExist = true;
            }
          }

        }
        if (!alreadyExist) {
          this.stateConnectorTaskConfig.push(JSON.parse(JSON.stringify(taskconfig)));
        }
      }
    }
  }

  getTempStateConnectorList() {
    const selectedTempTaskconfig: ConnectorConfig[] = [];
    for (let configName of this.tempState.connectorConfigList) {
      for (let taskconfig of this.tempStateConnectorList) {
        if (configName == taskconfig.connectorConfRefName) {
          selectedTempTaskconfig.push(taskconfig);
        }
      }
    }
    return selectedTempTaskconfig;
  }

  getTempConInfoList(configName) {
    if (this.tempSelectedConnectorInfoList[configName]) {
      return this.tempSelectedConnectorInfoList[configName];
    }
    return [];
  }

  onConInfoTaskSelect(event, taskConfig: ConnectorConfig, configName: string) {
    if (this.tempSelectedConnectorInfoList[configName] && this.tempSelectedConfigTypeTask[configName]) {
      for (let conInfo of this.tempSelectedConnectorInfoList[configName]) {
        if (this.tempSelectedConfigTypeTask[configName] == conInfo.type) {
          for (let tempsttaskconfog of this.tempStateConnectorList) {
            if (tempsttaskconfog.connectorConfRefName == configName) {
              const tempConRef = new ConnectorConfig();
              tempConRef.functionInstanceName = tempsttaskconfog.connectorConfigRef;
              var selectedTaskConfig = this.getConTaskConfigFromListOfStateconfigs(configName, conInfo, tempsttaskconfog.connectorConfigRef, tempsttaskconfog.configName);
              if (selectedTaskConfig == null) {
                selectedTaskConfig = this.createTempConTaskConfig(conInfo, tempConRef, configName);
              }
              var index = this.tempStateConnectorList.indexOf(tempsttaskconfog);
              if (index != -1) {
                this.tempStateConnectorList.splice(index, 1);
                this.addToTempStateTaskConfig(selectedTaskConfig, conInfo, configName);
                break;
              }


            }
          }
        }
      }
    }

  }

  getConTaskConfigFromListOfStateconfigs(connConfigName: string, conInfo: ConnectorInfo, functionInstanceName: string, configName: string) {
    if (this.stateConnectorTaskConfig && this.stateConnectorTaskConfig.length > 0) {
      if (this.stateTaskConfigFunctionInstanceMap && this.stateTaskConfigFunctionInstanceMap[this.tempState.stateCd] && this.stateTaskConfigFunctionInstanceMap[this.tempState.stateCd].length > 0) {
        for (let taskId of this.stateTaskConfigFunctionInstanceMap[this.tempState.stateCd]) {
          if (taskId == configName) {
            for (let stateConTaskConfig of this.stateConnectorTaskConfig) {
              if (stateConTaskConfig.taskConfig &&
                stateConTaskConfig.configType == conInfo.type &&
                stateConTaskConfig.connectorConfigRef == functionInstanceName) {
                if (stateConTaskConfig.configName != null && stateConTaskConfig.configName.length != 0 && taskId == stateConTaskConfig.configName) {
                  return stateConTaskConfig;

                }
              }
            }
          }
        }
      }

    }
    return null;
  }

  setConnectorTaskConfig() {
    var selectedCon: ConnectorConfig = null;
    var selectedConInfos: ConnectorInfo[] = [];
    var configNames: string[] = []
    if (this.tempState.connectorConfigList) {
      for (let configName of this.tempState.connectorConfigList) {
        configNames.push(configName);
      }
    }

    for (let connConfigName of configNames) {
      var isTaskConfigPresent = false;
      var conInfoTypeFound = false;
      this.tempSelectedConnectorInfoList[connConfigName] = []
      var foundInOldConfig = false; //this.getTaskConfigFromOldConfigForState(connConfigName);
      for (let con of this.connectorList) {
        if (con.configName == connConfigName) {
          selectedCon = con;
          selectedConInfos = []
          for (let conInfo of this.connectorInfoList) {
            if (conInfo.referenceType == con.configType) {
              selectedConInfos.push(conInfo);
              this.tempSelectedConnectorInfoList[connConfigName].push(conInfo);
              if (!foundInOldConfig) {
                if (!this.tempState.taskConfigList || this.tempState.taskConfigList.length == 0) {
                  const conTaskConfig = this.createTempConTaskConfig(conInfo, con, connConfigName);
                  this.addToTempStateTaskConfig(conTaskConfig, conInfo, connConfigName);
                }

              }

            }
          }

        }
      }

      for (let con of this.connectorList) {
        if (con.configName == connConfigName) {
          selectedCon = con;
          selectedConInfos = []
          for (let conInfo of this.connectorInfoList) {
            if (conInfo.referenceType == con.configType) {
              selectedConInfos.push(conInfo);
              if (!foundInOldConfig) {
                var foundTaskId = false;
                for (let tid of this.tempState.taskConfigList) {
                  const conTaskConfig = this.getConTaskConfigFromListOfStateconfigs(connConfigName, conInfo, con.functionInstanceName, tid);
                  if (conTaskConfig != null) {
                    conInfoTypeFound = true;
                    this.tempSelectedConfigTypeTask[connConfigName] = conInfo.type;
                    this.addToTempStateTaskConfig(conTaskConfig, conInfo, connConfigName);
                  }
                }

              }

            }
          }

        }
      }

      for (let con of this.connectorList) {
        if (con.configName == connConfigName) {
          selectedCon = con;
          selectedConInfos = []
          for (let conInfo of this.connectorInfoList) {
            if (conInfo.referenceType == con.configType) {
              selectedConInfos.push(conInfo);
              if (!foundInOldConfig) {
                if (!conInfoTypeFound) {
                  this.tempSelectedConfigTypeTask[connConfigName] = this.tempSelectedConnectorInfoList[connConfigName][0].type;
                }
                const conTaskConfig = this.createTempConTaskConfig(conInfo, con, connConfigName);
                this.addToTempStateTaskConfig(conTaskConfig, conInfo, connConfigName);
              }

            }
          }

        }
      }




    }


  }

  createTempConTaskConfig(selectedConInfo: ConnectorInfo, selectedCon: ConnectorConfig, connectorName: string) {
    var conTaskConfig = new ConnectorConfig();
    conTaskConfig.taskConfig = true;
    conTaskConfig.configType = selectedConInfo.type;
    conTaskConfig.connectorInfoRef = selectedConInfo.type;
    conTaskConfig.connectorConfigRef = selectedCon.functionInstanceName;
    conTaskConfig.configName = uuid();
    conTaskConfig = this.convertConInfoToStateTaskConfig(selectedConInfo, conTaskConfig);
    return conTaskConfig;

  }


  convertConInfoToStateTaskConfig(masterConInfo: ConnectorInfo, stateConTaskConfig: ConnectorConfig) {
    if (masterConInfo && stateConTaskConfig) {
      stateConTaskConfig.configMap = {};
      for (let key in masterConInfo.metaData) {
        stateConTaskConfig.configMap[key] = null;
      }
      if (!stateConTaskConfig.taskObject) {
        stateConTaskConfig.taskObject = new TaskObject();
      }
      for (let key in masterConInfo.payload) {
        stateConTaskConfig.taskObject.body[key] = masterConInfo.payload[key];
      }
    }
    return stateConTaskConfig;

  }

  getKeys(map) {
    var keys = []
    for (let key in map) {
      keys.push(key);
    }
    return keys;

  }


  getConInfoByType(type) {
    this.subscriptionConConfig = this.connectorConfigService.getConInfoByType(type)
      .subscribe(conInfo => {
        if (conInfo) {
          this.conInfoOfNoMetadata = conInfo;
          this.addConfigParamsForNoMetatData();
        }
      });
  }

  connectorSelected(conInfo) {
    this.specificConfigSelected = true;
    this.selectedConInfo = conInfo;
    this.configList = [];
    this.payloadList = [];
    this.typeConfigList = [];
    this.populateSelectedResponse()
    if (this.isEmpty(conInfo.metaData) == false) {
      for (const property in conInfo.metaData) {
        const map = new Map();
        const typeMap = new Map();

        map.set('key', property);
        typeMap.set('key', property);
        typeMap.set('value', conInfo.metaData[property]["type"])
        if (conInfo.metaData[property]["mandatory"] == true) {
          //entry.metaData['configMap'][property] = "";
          //mandatoryList.push(property);
        }
        if (this.stateCreateMode) {
          map.set('value', "");
          if (conInfo.metaData[property]["type"] == 'file') {
            this.fileName = "Please upload a file"
          }

          if (conInfo.metaData[property]["type"] == 'list') {

            map.set('values', conInfo.metaData[property]["valueList"])
          }

        }
        else {
          let value = this.tempState.taskConfig[0].configMap[property];
          if (this.tempState.taskConfig[0].configType == conInfo.type) {
            if (conInfo.metaData[property]["type"] == 'file') {
              let urlArr = value.split("/")
              this.fileName = urlArr[urlArr.length - 1]
            }
            if (conInfo.metaData[property]["type"] == 'list') {
              if (value == 1) {
                value = true
              }
              else if (value == 0) {
                value = false
              }
              this.temp[property] = value;
              map.set('values', conInfo.metaData[property]["valueList"])
            }
            map.set('value', value);
          }
          else {
            map.set('value', "");
            this.fileName = "Please upload a file"
          }
        }
        this.configList.push(map);
        this.typeConfigList.push(typeMap);

      }
    }
    else {
      if (this.conInfoOfNoMetadata._id != null) {
        if (this.conInfoOfNoMetadata.type == this.tempConConfig.configType) {
          this.addConfigParamsForNoMetatData();
        }
        else {
          this.getConInfoByType(this.tempConConfig.configType)
        }

      }
      else {
        this.getConInfoByType(this.tempConConfig.configType);

      }
    }

    if (this.isEmpty(conInfo.payload) == false) {

      for (const property in conInfo.payload) {
        const map = new Map();
        map.set('key', property);

        if (this.stateCreateMode) {
          map.set('value', "");
        }
        else {
          let value = this.tempState.taskConfig[0].taskObject.body[property];
          if (this.tempState.taskConfig[0].configType == conInfo.type) {
            map.set('value', value);
          }
          else {
            map.set('value', "");
          }
        }
        this.payloadList.push(map);
      }
    }
    else {


      if (!this.stateCreateMode) {
        if (this.tempState.taskConfig) {
          if (this.tempState.taskConfig.length > 0) {
            if (this.tempState.taskConfig[0].configType == conInfo.type) {
              for (let property in this.tempState.taskConfig[0].taskObject.body) {
                const map = new Map();
                map.set('key', property);
                map.set('value', this.tempState.taskConfig[0].taskObject.body[property])
                this.payloadList.push(map);
              }
            }
          }
        }

      }
    }

  }

  addConfigParamsForNoMetatData() {
    for (const property in this.tempConConfig.configMap) {
      const map = new Map();
      const typeMap = new Map();
      typeMap.set('key', property);
      typeMap.set('value', this.conInfoOfNoMetadata.metaData[property]["type"])
      map.set('key', property);
      map.set('value', this.tempConConfig.configMap[property]);
      if (this.conInfoOfNoMetadata.metaData[property]["type"] == "list") {
        let value = this.tempConConfig.configMap[property];
        if (value == 1) {
          value = true
        }
        else if (value == 0) {
          value = false
        }
        this.temp[property] = value;
        map.set('values', this.conInfoOfNoMetadata.metaData[property]["valueList"]);
      }
      this.configList.push(map);
      this.typeConfigList.push(typeMap);
    }
  }

  addConfigParam() {
    const body = new Map();
    const typeBody = new Map();
    body.set('key', '');
    body.set('value', '');
    typeBody.set('key', '');
    typeBody.set('value', 'string');
    this.configList.push(body);
    this.typeConfigList.push(typeBody)
  }
  removeConfigBody(body: any) {
    if (body && this.configList && this.configList.includes(body)) {
      const index = this.configList.indexOf(body);
      this.configList.splice(index, 1);
    }
    if (body && this.typeConfigList && this.typeConfigList.includes(body)) {
      const index = this.typeConfigList.indexOf(body);
      this.typeConfigList.splice(index, 1);
    }
  }

  addPayloadParam() {
    const body = new Map();
    body.set('key', '');
    body.set('value', '');
    this.payloadList.push(body);
  }
  removePayloadBody(body: any) {
    if (body && this.payloadList && this.payloadList.includes(body)) {
      const index = this.payloadList.indexOf(body);
      this.payloadList.splice(index, 1);
    }
  }


  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  savetaskConfig() {

    //this.conConfig.configMap = {};
    for (const con of this.configList) {
      if (con.get('key') && con.get('key').trim().length > 0) {
        this.conConfig.configMap[con.get('key')] = con.get('value');
      }
    }

    for (const con of this.payloadList) {
      if (con.get('key') && con.get('key').trim().length > 0) {
        this.conConfig.taskObject.body[con.get('key')] = con.get('value');
      }
    }
    this.conConfig.connectorConfigRef = this.tempConConfig.functionInstanceName;
    this.conConfig.configName = this.tempState.stateCd;
    this.conConfig.connectorInfoRef = this.selectedConInfo.type;
    this.conConfig.configType = this.selectedConInfo.type;
    this.conConfig.taskObject.responseList = this.conConfig.taskObject.responseList;


    if (this.stateCreateMode) {
      this.conConfig.functionInstanceName = "";
      this.createConConfig();
    }

    else {
      this.conConfig.functionInstanceName = this.tempState.taskConfig[0].functionInstanceName;
      this.conConfig._id = this.tempState.taskConfig[0]._id;
      this.updateConConfig()
    }



    // this.checkValidation(this.conConfig.configMap,this.conConfig.configType)
    // if(this.mandatorySatisfied){
    //   if (this.conConfig._id && this.conConfig._id.length > 0) {
    //     this.updateApiConfig();
    //   } else {
    //     this.createConConfig();
    //   }
    // }
    // else{
    //   showModal("validationModal");
    // }


  }

  // checkValidation(configMap,configType){
  //       this.notSatisfiedDataPoints = [];
  //       if(this.conConfig.configName.length == 0){
  //         this.notSatisfiedDataPoints.push("name");
  //       }
  //       for(let mandatory of this.mainMandatoryMap[configType]){
  //         if(configMap[mandatory].length == 0){
  //           this.notSatisfiedDataPoints.push(mandatory);
  //         }
  //       }
  //       if(this.notSatisfiedDataPoints.length > 0){
  //         this.mandatorySatisfied = false;
  //       }
  //       else{
  //         this.mandatorySatisfied = true;
  //       }
  // }

  createConConfig() {
    this.subscription = this.connectorConfigService.createConConfig(this.conConfig)
      .subscribe(
        data => {
          this.tempState.taskConfig = [data];
          this.saveState()
          // this.alertService.success('Connector Config created successfully', true);
          // this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
        });
  }

  updateConConfig() {
    this.subscription = this.connectorConfigService.updateConConfig(this.conConfig)
      .subscribe(
        data => {
          this.tempState.taskConfig = [data];
          this.saveState()
          //this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
        });
  }





  removeResponse() {
    if (this.selectedResponse && this.conConfig.taskObject.responseList
      && this.conConfig.taskObject.responseList.includes(this.selectedResponse)) {
      const index = this.conConfig.taskObject.responseList.indexOf(this.selectedResponse);
      this.conConfig.taskObject.responseList.splice(index, 1);
    }
  }

  cloneResponse() {
    if (this.selectedResponse) {
      const clonedResponse = JSON.parse(JSON.stringify(this.selectedResponse));
      this.addResponse(clonedResponse);
    }
  }

  populateSelectedResponse() {
    if (this.conConfig && this.conConfig._id && this.conConfig._id.length > 0
      && this.conConfig.taskObject.responseList && this.conConfig.taskObject.responseList.length > 0) {
      this.selectedResponse = this.conConfig.taskObject.responseList[0];
    } else {
      this.conConfig.taskObject.responseList = [];
      this.addResponse();
      this.selectedResponse = this.conConfig.taskObject.responseList[0];
    }
  }

  addResponse(response?: ApiResponse) {
    let newResponse = null;
    if (response) {
      newResponse = response;
    } else {
      newResponse = new ApiResponse(this.responseTypeSource[0], this.paramsToSelectSource[0]);
    }

    if (newResponse.keyExpressionList && newResponse.keyExpressionList.length === 0) {
      this.addResponseExpression(newResponse);
    }
    this.conConfig.taskObject.responseList.push(newResponse);
  }


  addResponseExpression(response?: ApiResponse) {
    if (response) {
      response.keyExpressionList.push(new ApiKeyExpressionMap());
    } else if (this.selectedResponse) {
      this.selectedResponse.keyExpressionList.push(new ApiKeyExpressionMap());
    }
  }

  removeExpression(expression: ApiKeyExpressionMap) {
    if (expression && this.selectedResponse && this.selectedResponse.keyExpressionList
      && this.selectedResponse.keyExpressionList.includes(expression)) {
      const index = this.selectedResponse.keyExpressionList.indexOf(expression);
      this.selectedResponse.keyExpressionList.splice(index, 1);
    }
  }

  //********************** File uplodaing *******************

  fileEvent(event, config) {

    const input = new FormData();
    const file: File = event.target.files[0];
    input.append("file", event.target.files[0])
    input.append("fileName", file.name)
    this.fileSelected = true;
    this.selectedFile = input;
    this.fileName = file.name;
    // for (let config of this.requiredConfigList){
    //   if (config.get('key') == "file-upload"){
    //     config.set('value',file.name);
    //   }
    // }
    this.upload(config, file.name);

  }

  onFileUploadForTaskConfig(event, config) {
    const input = new FormData();
    const file: File = event.target.files[0];
    input.append("file", event.target.files[0])
    input.append("fileName", file.name)
    this.fileSelected = true;
    this.selectedFile = input;
    this.fileName = file.name;
    config.fileName = file.name;
    this.uploadFileForTaskConfig(config, file.name);
  }

  uploadFileForTaskConfig(config, filename) {
    if (this.selectedFile) {
      this.progressBarFlag = true;
      showModal("fileUploadModel");
      this.selectedFile.append("functionInstanceName", "emailTemplate");
      this.selectedFile.append("entityType", "templateUplaod");

      this.selectedFile.append("entityRef", filename);
      this.subscription = this.fileService.upload(this.selectedFile)

        .subscribe(
          response => {
            if (response && response["url"] && response["fileName"]) {
              let url = `${environment.interfaceService}` + response["url"]
              this.fileUploaded = true;
              this.fileUploadedUrl = url;
              config.value = url;
              this.progressBarFlag = false;
              closeModal("fileUploadModel");
            }
          })
    }
  }

  upload(config, filename) {
    if (this.selectedFile) {
      this.progressBarFlag = true;
      showModal("fileUploadModel");
      this.selectedFile.append("functionInstanceName", "emailTemplate");
      this.selectedFile.append("entityType", "templateUplaod");

      this.selectedFile.append("entityRef", filename);
      this.subscription = this.fileService.upload(this.selectedFile)

        .subscribe(
          response => {
            if (response && response["url"] && response["fileName"]) {
              let url = `${environment.interfaceService}` + response["url"]
              this.fileUploaded = true;
              this.fileUploadedUrl = url;
              for (const con of this.configList) {
                if (con.get('key') && con.get('key').trim().length > 0 && con.get('key') == config.get('key')) {
                  if (con && this.configList && this.configList.includes(con)) {
                    const index = this.configList.indexOf(con);
                    const body = new Map()
                    body.set('key', config.get('key'));
                    body.set('value', url)
                    this.configList.splice(index, 1, body);
                  }
                }
              }
              this.progressBarFlag = false;
              closeModal("fileUploadModel");
            }
          })
    }
  }
  uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      let random = Math.random() * 16 | 0;
      let value = char === "x" ? random : (random % 4 + 8);
      return value.toString(16);
    });
  }
  onAddChildDataPoint(dataPoint: DataPoint) {
    dataPoint.childdataPoints.push(new DataPoint());
  }

  deleteChildDataPoint(data, childDataPoint) {
    const index: number = data.indexOf(childDataPoint);
    if (index !== -1) {
      data.splice(index, 1);
    }
  }

  onValueSelect(event, config) {
    for (const con of this.configList) {
      if (con.get('key') && con.get('key').trim().length > 0 && con.get('key') == config.get('key')) {
        if (con && this.configList && this.configList.includes(con)) {
          const index = this.configList.indexOf(con);
          const body = new Map()
          body.set('key', config.get('key'));
          body.set('value', event)
          body.set('values', config.get('values'));
          if (event in this.temp == false) {
            this.temp[config.get('key')] = event
          }
          this.configList.splice(index, 1, body);
        }
      }
    }
  }

  expandExp(rule?: ApiKeyExpressionMap) {
    this.ruleKey = rule.key;
    this.ruleValue = rule.expression;
    this.previousExpression = rule.expression;
    this.selectedRule = rule;
    //showModal("mvelEditModal")
  }


  saveExp(key, value) {
    let newKey = true;
    for (let rule of this.tempState.ruleList) {
      if (rule.key.length > 0 && rule.key == key) {
        newKey = false;
      }
    }

    if (newKey) {
      this.selectedRule.expression = value;
    }
    this.previousExpression = "";
    closeModal("mvelEditModal");
  }

  dismiss() {
    this.selectedRule.expression = this.previousExpression;
    this.previousExpression = "";
  }

  deleteConfig(state?: any) {
    if (state && state.taskConfigList && state.taskConfigList.length > 0) {
      for (let config of state.taskConfigList) {
        this.toDeleteConfigList.push(config)
      }

    }
  }

  deleteTaskConfig() {
    if (this.toDeleteConfigList.length > 0) {
      for (let con of this.toDeleteConfigList) {
        this.subscription = this.connectorConfigService.deleteTaskConfig(con)
          .subscribe(
            data => {
            });
      }
      this.toDeleteConfigList = [];
    }
  }

  testExpression() {

    this.mvelObject.expression = this.selectedRule.expression;
    this.graphService.testMVELExpression(this.mvelObject)
      .subscribe(mvelObject => {
        if (mvelObject) {
          this.mvelObject = mvelObject;
        }
      });


  }

  removeStateConnectorTaskConfig() {
    let taskConfigArr = this.stateConnectorTaskConfig;
    if (this.toDeleteConfigList.length > 0) {
      for (let name of this.toDeleteConfigList) {
        for (let config of this.stateConnectorTaskConfig) {
          if (name == config.configName) {
            const index = taskConfigArr.indexOf(config);
            taskConfigArr.splice(index, 1);
          }
        }
      }
      this.stateConnectorTaskConfig = taskConfigArr;
    }
  }

  getEntityFields(dataModel?: DataModel) {
    this.subscription = this.dataModelService.getDataModel(dataModel._id)
  .subscribe(
    datamodel => {
      if (datamodel) {
       this.tempGraphObject.entity = datamodel;
       this.entityselected = true;
      }
    });
  }

  getDataModelList() {
      const commonsearchModel = new CommonSearchModel();
      commonsearchModel.searchParams = [{ 'statusCd': 'ACTIVE' }, { 'type': 'Entity' }];
      commonsearchModel.returnFields = ['label', 'version', 'statusCd'];
      this.subscription = this.dataModelService.getDataModelList(commonsearchModel)
        .subscribe(list => this.dataModelList = list);
  }

  onEntitySelect(event){
    this.getEntityFields(this.selectedDataModel);
    // this.tempGraphObject.entity = this.selectedDataModel;

  }

  designEntity(){
    this.entityRedirect = true;
  }

  dismissEntityWarn(){
    this.entityRedirect = false;
  }

  redirect(){
    if(this.entityRedirect){
      this.router.navigate(['/pg/stp/stdms'], { relativeTo: this.route });
    }
  }

  onAddManualTaskStatus() {
    if (this.tempState != null) {
      if (this.tempState.statusList == null) {
        this.tempState.statusList = [];
      }
      this.tempState.statusList.push(new LabelValue);
    }    
  }
    
  onRemoveManualTaskStatus(labelValue: LabelValue) {
    if (this.tempState != null &&  this.tempState.statusList.length > 0) {
      let index = this.tempState.statusList.indexOf(labelValue);
      if (index != -1 ) {
        this.tempState.statusList.splice(index, 1);
      }
    }
  }

  onAddTaskValidation() {
    if (this.tempState != null) {
      if (this.tempState.taskValidations == null) {
        this.tempState.taskValidations = [];
      }
      this.tempState.taskValidations.push(new TaskValidation());
    }
  }

  onRemoveTaskValidation(validation: TaskValidation) {
    if (this.tempState != null && this.tempState.taskValidations != null && this.tempState.taskValidations.length > 0) {
      let index = this.tempState.taskValidations.indexOf(validation);
      if (index != -1) {
        this.tempState.taskValidations.splice(index, 1);
      }
    }
  }


  fetchAgents() {
    const fields = [];
    fields.push("_id");
    fields.push("name");
    this.subscription = this.agentService.getAllAgents(fields)
      .subscribe(
        agents => {
          if (agents) {
            this.virtualAgentList = agents;
          }
        }
      );
  }

  onChangeDataPointAccess(event, dataPointAccess: DataPointAccess, access: string) {
    if (access == "WRITE") {
      if (event.target.checked) {
        dataPointAccess.readAcsess = true;
        dataPointAccess.hide = false;
        dataPointAccess.writeAccess = true;
      }
      else {
        dataPointAccess.readAcsess = true;
        dataPointAccess.hide = false;
        dataPointAccess.writeAccess = false;
      }
    } 
    if (access == "HIDE") {
      if (event.target.checked) {
        dataPointAccess.writeAccess = false;
        dataPointAccess.readAcsess = false;
        dataPointAccess.hide = true;
      }
      else {
        dataPointAccess.writeAccess = true;
        dataPointAccess.readAcsess = true;
        dataPointAccess.hide = false;
      }
    }
    if (access == "READ") {
      if (event.target.checked) {
        dataPointAccess.writeAccess = false;
        dataPointAccess.hide = false;
        dataPointAccess.readAcsess = true;
      }
      else {
        dataPointAccess.readAcsess = false;
      }
      
    }
  }
  
}
