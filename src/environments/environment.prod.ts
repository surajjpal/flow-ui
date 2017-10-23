export const environment = {
  production: true,
  name: 'production',
  server: 'http://flow.automatapi.com/',
  activestateurl: 'state/bystatus/ACTIVE',
  folderurl: 'state/byusergroupandmachinetypeandstatus/admin',
  paramurl: 'statemachine/machinetypeparams/',
  updatestatemachineurl: 'statemachine/',
  menutreeurl: 'menu/tree',
  menuurl: 'menu/',
  menurouteurl: 'menu/route',
  parentmenuurl: 'menu/fetchparent/',
  messageurl: 'data/message/byuser/Admin',
  stateflowimageurl: 'statemachine/stateflow/',
  autosummary: 'autodashboard/CONVERSATION_SUMMARY',
  graphurl: 'graph/',
  entryactionurl: 'graph/actions',
  autodashboardurl: 'autodashboard',
  authurl: 'auth/',
  registerurl: 'auth/createUser',
  updateuserurl: 'auth/update',
  authoritiesurl: 'auth/roles',
  roleroutemapurl: 'master/roleroutemap',
  rolesurl: 'master/roles',
  routesurl: 'master/routes',

  // auto
  autoServer: 'https://cors-anywhere.herokuapp.com/https://auto.automatapi.com/',   // TODO: remove proxy
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
  // wheelsemiserver: 'https://cors-anywhere.herokuapp.com/http://169.54.3.12/',
  wheelsemiserver: 'http://169.54.3.12/',
  savedomainurl: 'domain',
  fetchdomainurl: 'fetchdomain?query=',
  saveagenturl: 'agent',
  fetchagenturl: 'fetchagent?query=',
  saveaccounturl: 'saveaccount',
  fetchresponse: 'fetchresponse?', // fetchresponse?intentName=information&entityName=policy is actual url
  uploadintentexcelurl: 'uploadintents',
  uploadentityexcelurl: 'uploadentity'
};
