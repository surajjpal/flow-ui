export const environment = {
    production: true,
    name: 'production',
  
    // Root
    root: 'https://flow.automatapi.com/flow/',
      
    // API
    authurl: 'https://flow.automatapi.com/flow/auth/',
  
    // Services
    saveaccounturl: 'https://flow.automatapi.com/flow/services/saveaccount',
    fetchaccountbyidurl: 'https://flow.automatapi.com/flow/services/fetchaccountbyid?query=',
  
    // Interfaces
    updateIntentTraining: 'https://flow.automatapi.com/flow/interfaces/intent_classification_training',
    updateEntityTraining: 'https://flow.automatapi.com/flow/interfaces/entity_classification_training',
  
    // Flow
    server: 'https://flow.automatapi.com/flow/console/',
    autourl:'https://api.automatapi.com/?',
  
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
    autoServer: 'https://flow.automatapi.com/flow/auto/',
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
  
    savedomainurl: 'domain',
    fetchdomainurl: 'fetchdomain?query=',
    saveagenturl: 'agent',
    fetchagenturl: 'fetchagent?query=',
    fetchresponse: 'fetchresponse?', // fetchresponse?intentName=information&entityName=policy is actual url
    uploadintentexcelurl: 'uploadintents',
    uploadentityexcelurl: 'uploadentity',
    modelkeyslookupurl: 'load/modelkeys',
    validationtypekeyslookupurl: 'load/validations'
  };
  