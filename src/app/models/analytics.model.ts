export class AnalyticsReportSetup {
    reportName: string;
    toEmailIds: string[];
    ccEmailIds: string[];
    subscription: string[];
    scheduleHour: number;
    scheduleMinute: number;
    scheduleSecond: number;
    scheduleDayOfWeek: number;
    scheduleTime: any;
    scheduleDayOfMonth: number;
    scheduleMonth: string;
    scheduleDate: Date;
    endDateTime: Date;

    constructor() {
        this.reportName = null;
        this.toEmailIds = [];
        this.ccEmailIds = [];
        this.subscription = null;
        this.scheduleHour = 0;
        this.scheduleMinute = 0;
        this.scheduleSecond = 0;
        this.scheduleDayOfWeek = 0;
        this.scheduleDayOfMonth = 0;
        this.scheduleMonth = null;
        this.endDateTime = null;
        this.scheduleDate = new Date();
    }
}