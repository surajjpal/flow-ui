export const environment = {
  production: false,
  name: 'local',
  server: 'http://localhost:8080/',
  statebyfolderurl: '/state/page/0,200,', // folder: Group, Personal
  statebystatusurl: '/state/pagebystatus/0,200,', // status: CLOSED, ACTIVE
  updatestatemachineurl: 'statemachine/',
  menutreeurl: 'menu/tree',
  menuurl: 'menu/',
  menurouteurl: 'menu/route',
  parentmenuurl: 'menu/fetchparent/',
  messageurl: 'data/message/byuser/Admin',
  stateflowimageurl: 'statemachine/stateflow/',
  autosummary: 'autodashboard/CONVERSATION_SUMMARY',
  graphurl: 'graph/',
  graphbystatusurl: 'graph/findbystatus/',
  entryactionurl: 'graph/actions',
  autodashboardurl: 'autodashboard',
  authurl: 'auth/',
  registerurl: 'auth/createUser',
  updateuserurl: 'auth/update',
  authoritiesurl: 'auth/roles',
  roleroutemapurl: 'master/roleroutemap',
  rolesurl: 'master/roles',
  routesurl: 'master/routes',
  apiconfigurl: 'api/',
  supportedmethodsurl: 'api/supportedMethods',

  // auto
  autoServer: 'https://cors-anywhere.herokuapp.com/http://169.54.3.12/',  
  episodelisturl: 'load/episodes?query=',
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

  // Wheels EMI
  wheelsemiserver: 'http://169.54.3.12/',
  savedomainurl: 'domain',
  fetchdomainurl: 'fetchdomain?query=',
  saveagenturl: 'agent',
  fetchagenturl: 'fetchagent?query=',
  saveaccounturl: 'saveaccount',
  fetchresponse: 'fetchresponse?', // fetchresponse?intentName=information&entityName=policy is actual url
  uploadintentexcelurl: 'uploadintents',
  uploadentityexcelurl: 'uploadentity',
  modelkeyslookupurl: 'load/modelkeys'
};
