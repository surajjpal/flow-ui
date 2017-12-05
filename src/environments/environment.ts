// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  name: 'development',

  // Auth
  authurl: 'http://108.168.190.82:8080/flow/auth/',

  // Services
  saveaccounturl: 'http://108.168.190.82:8080/flow/services/saveaccount',

  // Flow
  server: 'http://108.168.190.82:8080/flow/console/',
  statebyfolderurl: 'state/page/0,200,', // folder: Group, Personal
  statebystatusurl: 'state/pagebystatus/0,200,', // status: CLOSED, ACTIVE
  updatestatemachineurl: 'statemachine/',
  menutreeurl: 'menu/tree',
  menuurl: 'menu/',
  menurouteurl: 'menu/route',
  parentmenuurl: 'menu/fetchparent/',
  messageurl: 'data/message/byuser/Admin',
  stateflowimageurl: 'statemachine/stateflow/',
  autosummary: 'dashboard/CONVERSATION_SUMMARY',
  graphurl: 'graph/',
  graphbystatusurl: 'graph/findbystatus/',
  entryactionurl: 'graph/actions',
  autodashboardurl: 'dashboard',
  userurl: 'user/',
  registerurl: 'user/createUser',
  createcompanyadminurl: 'user/createcompanyadmin',
  updateuserurl: 'user/update',
  authoritiesurl: 'user/roles',
  roleroutemapurl: 'master/roleroutemap',
  rolesurl: 'master/roles',
  routesurl: 'master/routes',
  apiconfigurl: 'apiConfig/',
  supportedmethodsurl: 'apiConfig/supportedMethods',

  // auto
  autoServer: 'http://108.168.190.82:8080/flow/auto/',
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

  savedomainurl: 'domain',
  fetchdomainurl: 'fetchdomain?query=',
  saveagenturl: 'agent',
  fetchagenturl: 'fetchagent?query=',
  fetchresponse: 'fetchresponse?', // fetchresponse?intentName=information&entityName=policy is actual url
  uploadintentexcelurl: 'uploadintents',
  uploadentityexcelurl: 'uploadentity',
  modelkeyslookupurl: 'load/modelkeys'
};
