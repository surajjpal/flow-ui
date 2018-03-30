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
    reportName: string;
    toEmailIds: string[];
    ccEmailIds: string[];
    reportType: string;
    startDate: string;
    endDate: string;
    
    constructor() {
        this.reportName = null;
        this.toEmailIds = [];
        this.ccEmailIds = [];
        this.reportType = null;
        this.startDate = null;
        this.endDate = null;
    }

    setValues(reportName, toEmailIds, ccEmailIds, reportType, startDate, endDate) {
        this.reportName = reportName;
        this.toEmailIds = toEmailIds;
        this.ccEmailIds = ccEmailIds;
        this.reportType = reportType;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}