export const environment = {
  production: true,
  name: 'production',

  // Root
  root: 'https://flow.automatapi.io/flow/',

  // API
  authurl: 'https://flow.automatapi.io/flow/auth/',

  // Services
  saveaccounturl: 'https://flow.automatapi.io/flow/account/create',
  fetchaccountbyidurl: 'https://flow.automatapi.io/flow/account/',
  publishaccounturl: 'https://flow.automatapi.io/flow/account/publish/',
  unpublishaccounturl: 'https://flow.automatapi.io/flow/account/unpublish/',

  // count assigned and unassigned url
  assignedunassignedurl:'state/countbystatusandfolder/ACTIVE',

  processauditurl: "http://localhost:5000/api/universalsearch/search/flow",
  // Interfaces
  interfaceService: 'https://flow.automatapi.io/flow/interfaces',
  updateClassifierTraining: 'https://flow.automatapi.io/flow/interfaces/auto_decorate_training',
  updateIntentTraining: 'https://flow.automatapi.io/flow/interfaces/intent_classification_training',
  updateEntityTraining: 'https://flow.automatapi.io/flow/interfaces/entity_classification_training',

  // Flow
  server: 'https://flow.automatapi.io/flow/console/',
  autourl: 'https://agent.automatapi.xyz/#/pg/ch/cnv/',

  autoworkbench: 'https://workbench.automatapi.com/#/wb/',
  autoworkbenchdisplaybar: '?displaySideBar=false',

  stateinsight: 'state/insight/',
  orPayload: 'state/orPayload/',
  orPayloadMachineType: 'state/saveOrPayload/machineType/',
  statebystatusandfolderurl: 'state/pagebystatusandfolder/', // status: CLOSED, ACTIVE; folder: Group, Personal
  statebysubstatusandfolderurl: 'state/pagebysubstatusandfolder/',
  saveflaggedstate: 'state/saveFlaggedState',
  savearchivestate: 'state/archive',
  gettatrecords: 'state/fetchtat',
  getallstats: 'state/fetchstatestatus',
  getpersonalstats: 'state/getstatestatusbyuser',
  getstateinstance: 'state/fetchstateinstance',
  getDocuments: 'state/documents',
  menutreeurl: 'menu/tree',
  menuurl: 'menu/',
  menurouteurl: 'menu/route',
  parentmenuurl: 'menu/fetchparent/',
  messageurl: 'data/message/byuser/Admin',
  stateflowimageurl: 'statemachine/stateflow/',
  updatestatemachineurl: 'statemachine/updateflow/withState',
  alocateuserurl: 'statemachine/allocateto',
  graphobjectbyflowinstanceid: 'statemachine/graphobject',
  autosummary: 'dashboard/CONVERSATION_SUMMARY',
  graphurl: 'graph/',
  usergraphurl: 'usergraph/saveUserGraph/',
  getusergraphurl: 'usergraph/',
  graphbystatusurl: 'graph/findbystatus/',
  entryactionurl: 'graph/actions',
  timeruniturl: 'graph/timerunit',
  autodashboardurl: 'dashboard',
  userurl: 'user/',
  evaluateMVEL: 'evaluateMVEL/',
  statebyid: 'state/',
  
  route: 'route/',
  functionalTestCases: 'route/tests',
  ftcRouteTrigger: 'api/route/',
  timeline: 'statemachine/timeline/',
  updatevirtualassist: 'statemachine/updatevirtualassist',

  registerurl: 'user/createUser',
  forgotpassword: 'user/forgotPassword',
  savehierarchy: 'user/hierarchy',
  getuserhierarchy: 'user/getUserHierarchy/',
  userchildren: 'user/userChildren',


  createcompanyadminurl: 'user/createcompanyadmin',
  updateuserurl: 'user/update',
  authoritiesurl: 'user/roles',
  userlisturl: 'user/getUserList/',
  roleroutemapurl: 'master/roleroutemap',
  rolesurl: 'master/roles',
  routesurl: 'master/routes',
  apiconfigurl: 'apiConfig/',
  supportedmethodsurl: 'apiConfig/supportedMethods',

  getallconnectorinfo: 'connectorInfo/',
  saveconnectorinfo: 'connectorInfo/save/',
  deleteconnectorinfo: 'connectorInfo/delete/',

  //DataModelUrls
  datamodelurl: 'dataModel/',
  datamodelsaveurl: 'dataModel/savedatamodel',

  //EntityUrls
  entityurl: 'entity/',
  entitysaveurl: 'entity/save',
  entitysubmiturl: 'entity/submit',

  connectorinfo: 'connectors/',
  getallconconfig: 'connectors/getAll/',
  deleteconconfig: 'connectors/delete/',
  deletetaskconfig: 'connectors/deleteTaskConfig/',
  saveconconfig: 'connectors/save/',
  getallconinfo: 'connectors/getConInfo/',
  getconinfobytype: 'connectors/getConInfoByType/',


  // auto
  autoServer: 'https://flow.automatapi.io/flow/auto/',
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

  flowsearch: '/api/search/flow',

  // Analytics
  reportservice: 'https://flow.automatapi.io/flow/report',
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
  dashboardServer: 'https://flow.automatapi.io/flow/dashboard/',
  dashboardsummary: 'auto/dashboard_summary',
  episodetimeline: 'auto/episode_timeline',
  intentcount: 'auto/intent_count',
  entitycount: 'auto/entity_count',
  sentimentcount: 'auto/sentiment_count',
  goal_count: 'auto/goal_count',
  episodemessages: 'auto/episode_message',
  flowdashboardsummary: 'flow/dashboard_summary',
  flowtimeline: 'flow/flow_timeline',
  transactionvalues: 'flow/transaction_values',
  avgstatetime: 'flow/avgstate_time',
  resourcevalues: 'flow/resources_values',
  statetransactionvalue: 'flow/state_transaction_value',

  //Dashboard from interfaces
  dashboardinterface: 'https://flow.automatapi.io/flow/interfaces/dashboard',

  //Following APIs path - To be used in conjunction with interfaceService property
  crudFunction: '/crud',
  smCrudFunction: '/smCrudApi',
  sendAgentMessage: '/sendMessage',

  // activity monitor services
  businessDataPointValues: 'businessactivitymanagement/datapointvalues',
  businessDataPoints: 'businessactivitymanagement/datapoints',
  businessDataPonitsPercentageCount: 'businessactivitymanagement/datapoint/percentagecount',
  businessDataPonitsGraphData: 'businessactivitymanagement/graphdata',
  businessFilterDataPonitsGraphData: 'businessactivitymanagement/datapoint/graphdata',

  //python project in api-utils ondemandreport project
  sendReportCSV: 'https://flow.automatapi.io/flow/report/reports/generatereport',

  //Vocabulary
  vocabulary: 'https://flow.automatapi.io/flow/interfaces/vocabulary',

  // USP
  uspsearch: '/api/usp/relevancesearch',
  uspselftrain: '/api/usp/selftrain',

};
