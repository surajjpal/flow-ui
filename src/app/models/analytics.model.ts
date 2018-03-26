export class AnalyticsReportSetup {
    reportName: string;
    toEmailIds: string[];
    ccEmailIds: string[];
    subscription: string[];
    scheduleHour: number;
    scheduleMinute: number;
    scheduleSecond: number;
    scheduleDayOfWeek: string;
    scheduleTime: {hour: 0, minute: 0};
    scheduleDayOfMonth: number;
    scheduleMonth: string;
    endDateTime: Date;

    constructor(reportName?, toEmailds?, ccEmailIds?, subscription?, scheduleHour?, scheduleMinute?, scheduleSecond?, scheduleDayOfweek?, scheduleDayOfMonthe?, scheduleMonth?, endDateTime?) {
        this.reportName = reportName;
        this.toEmailIds = toEmailds;
        this.ccEmailIds = ccEmailIds;
        this.subscription = subscription;
        this.scheduleHour = scheduleHour;
        this.scheduleMinute = scheduleMinute;
        this.scheduleSecond = scheduleSecond;
        this.scheduleDayOfWeek = scheduleDayOfweek;
        this.scheduleDayOfMonth = scheduleMonth;
        this.scheduleMonth = scheduleMonth;
        this.endDateTime = endDateTime;
    }
}