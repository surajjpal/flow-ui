// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  name: 'development',
  server: 'http://flow.automatapi.xyz/',
  activestateurl: 'state/bystatus/ACTIVE',
  folderurl: 'state/byusergroupandmachinetypeandstatus/admin',
  paramurl: 'statemachine/machinetypeparams/',
  updatestatemachineurl: 'statemachine/',
  menutreeurl: 'menu/tree',
  menuurl: 'menu/',
  parentmenuurl: 'menu/fetchparent/',
  messageurl: 'data/message/byuser/Admin',
  stateflowimageurl: 'statemachine/stateflow/',
  autosummary: 'autodashboard/CONVERSATION_SUMMARY',
  graphurl: 'graph/',
  autodashboardurl: 'autodashboard',
  loginurl: 'auth/',
  registerurl: 'auth/createUser',

  // wheels emi
  wheelsServer: 'http://wheelsemi.automatapi.xyz/',
  episodelisturl: 'load/episodes?query=',
  messagelisturl: 'load/messages?query=',
  trainingdataurl: 'load/trainingdata',

  // auto
  autoServer: 'http://auto.automatapi.xyz/',
  uploadtrainingexcelurl: 'load/excelupload'
};
