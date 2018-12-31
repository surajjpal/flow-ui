export const environment = {
  production: false,
  name: 'local',

  // Root
  root: 'http://localhost:8080/flow/',
  
    // API
  authurl: 'http://localhost:8080/flow/auth/',

  // Services
  saveaccounturl: 'http://localhost:8080/flow/account/create',
  fetchaccountbyidurl: 'http://localhost:8080/flow/account/',
  publishaccounturl:'http://localhost:8080/flow/account/publish/',
  unpublishaccounturl:'http://localhost:8080/flow/account/unpublish/',

  // Interfaces
  interfaceService: 'http://localhost:8080/flow/interfaces',
  updateClassifierTraining : 'http://localhost:8080/flow/interfaces/auto_decorate_training',
  updateIntentTraining: 'http://localhost:8080/flow/interfaces/intent_classification_training',
  updateEntityTraining: 'http://localhost:8080/flow/interfaces/entity_classification_training',
  

  //
  processauditurl:"http://localhost:5000/api/universalsearch/search/flow",

  // Flow
  server: 'http://localhost:8080/flow/console/',
  autourl:'http://localhost:4200/#/pg/ch/cnv/',
  stateinsight: 'state/insight/',
  orPayload: 'state/orPayload/',
  orPayloadMachineType:'state/saveOrPayload/machineType/',
  statebystatusandfolderurl: 'state/pagebystatusandfolder/',// status: CLOSED, ACTIVE; folder: Group, Personal
  statebysubstatusandfolderurl:'state/pagebysubstatusandfolder/',
  saveflaggedstate:'state/saveFlaggedState',
  savearchivestate:'state/archive',
  gettatrecords:'state/fetchtat',
  getallstats:'state/fetchstatestatus',
  getpersonalstats:'state/getstatestatusbyuser',
  getstateinstance:'state/fetchstateinstance',
  menutreeurl: 'menu/tree',
  menuurl: 'menu/',
  menurouteurl: 'menu/route',
  parentmenuurl: 'menu/fetchparent/',
  messageurl: 'data/message/byuser/Admin',
  stateflowimageurl: 'statemachine/stateflow/',
  updatestatemachineurl: 'statemachine/updateflow/withState',

  alocateuserurl:'statemachine/allocateto',
  graphobjectbyflowinstanceid: 'statemachine/graphobject',
  autosummary: 'dashboard/CONVERSATION_SUMMARY',
  graphurl: 'graph/',
  usergraphurl: 'usergraph/saveUserGraph/',
  getusergraphurl:'usergraph/',
  graphbystatusurl: 'graph/findbystatus/',
  entryactionurl: 'graph/actions',
  timeruniturl: 'graph/timerunit',
  autodashboardurl: 'dashboard',
  userurl: 'user/',

  registerurl: 'user/createUser',

  forgotpassword:'user/forgotPassword',
  savehierarchy:'user/hierarchy',
  getuserhierarchy:'user/getUserHierarchy/',
  userchildren:'user/userChildren',


  createcompanyadminurl: 'user/createcompanyadmin',
  updateuserurl: 'user/update',
  authoritiesurl: 'user/roles',
  userlisturl:'user/getUserList/',
  roleroutemapurl: 'master/roleroutemap',
  rolesurl: 'master/roles',
  routesurl: 'master/routes',
  apiconfigurl: 'apiConfig/',

  supportedmethodsurl: 'apiConfig/supportedMethods',
  
  connectorinfo:'connectors/',
  getallconconfig:'connectors/getAll/',
  deleteconconfig:'connectors/delete/',
  saveconconfig:'connectors/save/',
  getallconinfo:'connectors/getConInfo/',
  getconinfobytype:'connectors/getConInfoByType/',



  // Auto
  autoServer: 'http://localhost:8080/flow/auto/',
  episodelisturl: 'load/episodes?query=',
  episodebyidurl: 'load/episode?query=',
  messagelisturl: 'load/messages?query=',
  trainingdataurl: 'load/trainingdata',
  uploadtrainingexcelurl: 'load/excelupload',
  createtrainingdataurl: 'add/trainingdata',
  updatetrainingdataurl: 'update/trainingdata',
  deletetrainingdataurl: 'delete/trainingdata?query=',

  getintenturl: 'load/intentclassifier',
  createintenturl: '',
  updateintenturl: 'update/intentclassifier',
  deleteintenturl: 'delete/intentclassifier?query=',

  getentityurl: 'load/entityclassifier',
  createentityurl: '',
  updateentityurl: 'update/entityclassifier',
  deleteentityurl: 'delete/entityclassifier?query=',

  fetchresponse: 'fetchresponse?', // fetchresponse?intentName=information&entityName=policy is actual url
  uploadintentexcelurl: 'uploadintents',
  uploadentityexcelurl: 'uploadentity',
  modelkeyslookupurl: 'load/modelkeys',
  validationtypekeyslookupurl: 'load/validations',


  flowsearch:'/api/search/flow',

  // Analytics
  reportservice: 'http://localhost:8080/flow/report',
  sendReportUrl: '/reports/analyticsreport/sendreport',
  scheduleAnalyticsReport: '/reports/analyticsreport/schedulereport',
  getAnalyticsReports: "/reports/analyticsreport",
  getanalyticsReportTemplates: "/reports/analyticsreport/template",
  getanalyticsReportEmailTemplates: "/reports/analyticsreport/emailtemplate",

  // Schedule
  scheduleTaskConfiguration: "api/schedule/",
  
  // file upload download service
  fileUploadUrl: '/api/uploadData',
  fileDownloadUrl: '/api/downloadData',

  // api design
  algorithmUrl: '/automatons/algorithm',
  businessObjectUrl: '/automatons/businessobject',
  businessObjectTrainingUrl: '/automatons/businessobject/training',
  businessObjectActivateTrainerUrl: '/automatons/businessobject/activate',
  businessObjectDectivateTrainerUrl: '/automatons/businessobject/deactivate',
  businessObjectPredictUrl: '/automatons/businessobject/predict',
  
  //Dashboard
  dashboardServer: 'http://localhost:8080/flow/dashboard/',
  dashboardsummary:'auto/dashboard_summary',
  episodetimeline:'auto/episode_timeline',
  intentcount:'auto/intent_count',
  entitycount:'auto/entity_count',
  sentimentcount:'auto/sentiment_count',
  goal_count:'auto/goal_count',
  episodemessages:'auto/episode_message',
  flowdashboardsummary:'flow/dashboard_summary',
  flowtimeline:'flow/flow_timeline',
  transactionvalues:'flow/transaction_values',
  avgstatetime:'flow/avgstate_time',
  resourcevalues:'flow/resources_values',
  statetransactionvalue:'flow/state_transaction_value',

  //Dashboard from interfaces
  dashboardinterface: 'http://localhost:8080/flow/interfaces/dashboard',

  //Following APIs path - To be used in conjunction with interfaceService property
  crudFunction: '/crud',
  sendAgentMessage: '/sendMessage',

  // activity monitor services
  businessDataPointValues: 'businessactivitymanagement/datapointvalues',
  businessDataPoints: 'businessactivitymanagement/datapoints',
  businessDataPonitsPercentageCount: 'businessactivitymanagement/datapoint/percentagecount',
  businessDataPonitsGraphData: 'businessactivitymanagement/graphdata',
  businessFilterDataPonitsGraphData: 'businessactivitymanagement/datapoint/graphdata',
  
  //python project in api-utils ondemandreport project
  sendReportCSV: 'http://127.0.0.1:5000/generatereport',

  //Vocabulary
  vocabulary :'http://localhost:5000/api/vocabulary',
};
