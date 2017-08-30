export const environment = {
  production: false,
  name: 'local',
  server: 'http://localhost:8080/',
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
  autodashboardurl: 'autodashboard',
  loginurl: 'auth/',
  registerurl: 'auth/createUser',

  // auto
  autoServer: 'https://cors-anywhere.herokuapp.com/https://auto.automatapi.xyz/',   // TODO: remove proxy
  episodelisturl: 'load/episodes?query=',
  messagelisturl: 'load/messages?query=',
  trainingdataurl: 'load/trainingdata',
  uploadtrainingexcelurl: 'load/excelupload'
};
