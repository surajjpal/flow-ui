export const environment = {
    production: true,
    name: 'demo',

    // Root
    root: 'http://flow.automatapi.com/flow/',

    // API
    authurl: 'http://flow.automatapi.com/flow/auth/',

    // Services
    saveaccounturl: 'http://flow.automatapi.com/flow/account/create',
    fetchaccountbyidurl: 'http://flow.automatapi.com/flow/account/',
    publishaccounturl: 'http://flow.automatapi.com/flow/account/publish/',
    unpublishaccounturl: 'http://flow.automatapi.com/flow/services/unpublish/',



    // Interfaces
    interfaceService: 'http://flow.automatapi.com/flow/interfaces',
    updateClassifierTraining: 'http://flow.automatapi.com/flow/interfaces/auto_decorate_training',
    updateIntentTraining: 'http://flow.automatapi.com/flow/interfaces/intent_classification_training',
    updateEntityTraining: 'http://flow.automatapi.com/flow/interfaces/entity_classification_training',

    // Flow
    server: 'http://flow.automatapi.com/flow/console/',
    autourl: 'http://virtualagent.automatapi.xyz/#/pg/ch/cnv/',
    autoworkbench: 'http://workbench.automatapi.com/#/wb/',
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
    
    // count assigned and unassigned url
    assignedunassignedurl:'state/countbystatusandfolder/ACTIVE',

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

    connectorinfo: 'connectors/',
    getallconconfig: 'connectors/getAll/',
    deleteconconfig: 'connectors/delete/',
    deletetaskconfig: 'connectors/deleteTaskConfig/',
    saveconconfig: 'connectors/save/',
    getallconinfo: 'connectors/getConInfo/',
    getconinfobytype: 'connectors/getConInfoByType/',


    //DataModelUrls
    datamodelurl: 'dataModel/',
    datamodelsaveurl: 'dataModel/savedatamodel',

    //EntityUrls
    entityurl: 'entity/',
    entitysaveurl: 'entity/save',
    entitysubmiturl: 'entity/submit',


    // auto
    autoServer: 'http://flow.automatapi.com/flow/auto/',
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
    reportservice: 'http://flow.automatapi.com/flow/report',
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
    dashboardServer: 'http://flow.automatapi.com/flow/dashboard/',
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
    dashboardinterface: 'http://flow.automatapi.com/flow/interfaces/dashboard',

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
    sendReportCSV: 'http://flow.automatapi.com/flow/report/reports/generatereport',


    //Vocabulary
    vocabulary: 'http://flow.automatapi.com/flow/interfaces/vocabulary',

    // USP
    uspsearch: '/api/usp/relevancesearch',
    uspselftrain: '/api/usp/selftrain',

};
