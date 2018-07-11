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

  // Interfaces
  interfaceService: 'http://flow.automatapi.io/flow/interfaces',
  updateClassifierTraining : 'http://flow.automatapi.io/flow/interfaces/auto_decorate_training',
  updateIntentTraining: 'https://flow.automatapi.io/flow/interfaces/intent_classification_training',
  updateEntityTraining: 'https://flow.automatapi.io/flow/interfaces/entity_classification_training',

  // Flow
  server: 'https://flow.automatapi.io/flow/console/',
  autourl:'https://api.automatapi.io/?',

  stateinsight: 'state/insight/',
  orPayload: 'state/orPayload/',
  orPayloadMachineType:'state/saveOrPayload/machineType/',
  statebystatusandfolderurl: 'state/pagebystatusandfolder/', // status: CLOSED, ACTIVE; folder: Group, Personal
  statebysubstatusandfolderurl:'state/pagebysubstatusandfolder/',
  saveflaggedstate:'state/saveFlaggedState',
  savearchivestate:'state/archive',
  gettatrecords:'state/fetchtat',
  getallstats:'state/fetchstatestatus',
  getpersonalstats:'state/getstatestatusbyuser',
  menutreeurl: 'menu/tree',
  menuurl: 'menu/',
  menurouteurl: 'menu/route',
  parentmenuurl: 'menu/fetchparent/',
  messageurl: 'data/message/byuser/Admin',
  stateflowimageurl: 'statemachine/stateflow/',
  updatestatemachineurl: 'statemachine/updateflow/withState',
  alocateuserurl:'statemachine/allocateto',
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

  // Analytics
  sendReportUrl: 'analyticsreport',
  scheduleAnalyticsReport: '/reports/analyticsreport/schedulereport',
  
  // file upload download service
  fileUploadUrl: '/api/uploadData',
  fileDownloadUrl: '/api/downloadData',

  // api design
  algorithmUrl: '/automatons/algorithm',
  businessObjectUrl: '/automatons/businessobject',
  businessObjectTrainingUrl: '/automatons/businessobject/training',
  businessObjectActivateTrainerUrl: '/automatons/businessobject/activate',
  businessObjectDectivateTrainerUrl: '/automatons/businessobject/deactivate',
  
  //Dashboard
  dashboardServer: 'https://flow.automatapi.io/flow/dashboard/',
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
  dashboardinterface: 'https://flow.automatapi.io/flow/interfaces/dashboard',

  //CRUD API path - To be used in conjunction with interfaceService property
  crudFunction : '/crud'
};
