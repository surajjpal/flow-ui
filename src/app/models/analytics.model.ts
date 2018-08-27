import { ScheduleTaskConfiguration } from "app/models/scheduler.model";

export class AnalyticsReportSetup {
    reportName: string;
    toEmailIds: string[];
    ccEmailIds: string[];
    reportType: string;
    startDate: string;
    endDate: string;
    subscription: string[];
    scheduleHour: number;
    scheduleMinute: number;
    scheduleSecond: number;
    scheduleDayOfWeek: number;
    scheduleTime: any;
    scheduleDayOfMonth: number;
    scheduleMonth: string;
    scheduleDate: Date;
    timeZone: string;
    repeateCount: number;
    status: string;
    endDateTime: Date;

    constructor() {
        this.reportName = null;
        this.toEmailIds = [];
        this.ccEmailIds = [];
        this.reportType = null;
        this.startDate = null;
        this.endDate = null;
        this.subscription = null;
        this.scheduleHour = 0;
        this.scheduleMinute = 0;
        this.scheduleSecond = 0;
        this.scheduleDayOfWeek = 0;
        this.scheduleDayOfMonth = 0;
        this.scheduleMonth = null;
        this.endDateTime = null;
        this.scheduleDate = null;
    }
}

export class AnalyticsReport {

    _id: string;
    reportName: string;
    requestedReportType: string;
    reportCategory: string;
    toEmailIds: string[];
    ccEmailIds: string[];
    untilPreviousDay: boolean;
    zeppelinNotebookId: string;
    reportFileType: string;
    requestFilter = {}
    agentId: string;
    templateName: string;
    emailTemplateName: string;
    scheduleTaskConfigurationId: string;
    isInitAgentReport: boolean;
    scheduleConfig: ScheduleTaskConfiguration;
    companyId: string;
    
    constructor(_id?: string, reportName?: string, requestedReportType?: string, toEmailIds?: string[], ccEmailIds?: string[], untilPreviousDay?: boolean,
        zeppelinNotebookId?: string, reportFileType?: string, requestFilter?: {}, agentId?: string, templateName?: string, scheduleTaskConfigurationId?: string, isInitAgentReport?: boolean, scheduleConfig?: ScheduleTaskConfiguration, companyId?: string, emailTemplateName?: string
    ) {
        this._id = _id ? _id : null;
        this.reportName = reportName ? reportName : null;
        this.requestedReportType = requestedReportType ? requestedReportType : null;
        this.toEmailIds = toEmailIds ? toEmailIds : [];
        this.ccEmailIds = ccEmailIds ? ccEmailIds : [];
        this.untilPreviousDay = untilPreviousDay ? untilPreviousDay : false;
        this.zeppelinNotebookId = zeppelinNotebookId ? zeppelinNotebookId : null;
        this.reportFileType = reportFileType ? reportFileType : null;
        this.requestFilter = requestFilter ? requestFilter : {};
        this.agentId = agentId? agentId : null;
        this.templateName = templateName? templateName : null;
        this.emailTemplateName = emailTemplateName? emailTemplateName : null;
        this.scheduleTaskConfigurationId = scheduleTaskConfigurationId ? scheduleTaskConfigurationId : null;
        this.isInitAgentReport = isInitAgentReport ? isInitAgentReport : false;
        this.scheduleConfig = scheduleConfig? scheduleConfig : new ScheduleTaskConfiguration();
        this.companyId = companyId? companyId : null;
    }

    setValues(reportName, toEmailIds, ccEmailIds, reportType, startDate, endDate) {
        this.reportName = reportName;
        this.toEmailIds = toEmailIds;
        this.ccEmailIds = ccEmailIds;
        // this.reportType = reportType;
        // this.startDate = startDate;
        // this.endDate = endDate;
    }
}


export class Template {

    templateLabel: string;
    templateName: string;
    type: string;
    zeppelinNotebookId: string;
    agentId: string;

    constructor(templateLabel?: string, templateName?: string, type?: string, zeppelinNotebookId?: string, agentId?: string) {
        this.templateLabel = templateLabel ? templateLabel : null;
        this.templateName = templateName ? templateName : null;
        this.type = type ? type : null;
        this.zeppelinNotebookId = zeppelinNotebookId ? zeppelinNotebookId : null;
        this.agentId = agentId ? agentId : null;
    }
}


