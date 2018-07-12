
export class ScheduleTaskConfiguration {
    companyId: string;
	cronExpression: string;
	endTime: string;
	subscription: string;
	timeZone = null;
	scheduleSecond: number;
	scheduleMinute: number;
	scheduleHour: number;
	scheduleDayOfWeek: string;
	scheduleMonth = null;
	scheduleDayOfMonth: number;
    repeateCount: number;
    runAtTime: string;
    status: string;
    
    constructor(companyId?: string, cronExpression?: string, endTime?: string, subscription?: string, timeZone?: string, scheduleSecond?: number,
        scheduleMinute?: number, scheduleHour?: number, scheduleDayOfWeek?: string, scheduleMonth?: string, scheduleDayOfMonth?: number, repeateCount?: number, status?: string,
        runAtTime?: string
    ) {
        this.companyId = companyId ? companyId : null;
        this.cronExpression = cronExpression ? cronExpression : null;
        this.endTime = endTime ? endTime : null;
        this.subscription = subscription ? subscription : null;
        this.timeZone = timeZone ? timeZone : null;
        this.scheduleSecond = scheduleSecond ? scheduleSecond : 0;
        this.scheduleMinute = scheduleMinute ? scheduleMinute : 0;
        this.scheduleHour = scheduleHour ? scheduleHour : 0;
        this.scheduleDayOfWeek = scheduleDayOfWeek ? scheduleDayOfWeek : null;
        this.scheduleMonth = scheduleMonth ? scheduleMonth : null
        this.scheduleDayOfMonth = scheduleDayOfMonth ? scheduleDayOfMonth : 0;
        this.repeateCount = repeateCount ? repeateCount : 0;
        this.status = status ? status : null;
        this.runAtTime = runAtTime ? runAtTime : null;
    }

    setValues(companyId, cronExpression, endTime, subscription, timeZone, scheduleSecond, scheduleMinute, scheduleHour, scheduleDayOfWeek,
        scheduleMonth, scheduleDayOfMonth, repeateCount, status) {
            this.companyId = companyId;
            this.cronExpression = cronExpression;
            this.endTime = endTime;
            this.subscription = subscription;
            this.timeZone = timeZone;
            this.scheduleSecond = scheduleSecond;
            this.scheduleMinute = scheduleMinute;
            this.scheduleHour = scheduleHour;
            this.scheduleDayOfWeek = scheduleDayOfWeek;
            this.scheduleMonth = scheduleMonth;
            this.scheduleDayOfMonth = scheduleDayOfMonth;
            this.repeateCount = repeateCount;
            this.status = status;
    }

}