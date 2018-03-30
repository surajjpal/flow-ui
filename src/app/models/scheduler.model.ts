import { subscribeOn } from "rxjs/operator/subscribeOn";

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
    status: string;
    
    constructor() {
        this.companyId = null;
        this.cronExpression = null;
        this.endTime = null;
        this.subscription = null;
        this.timeZone = null;
        this.scheduleSecond = 0;
        this.scheduleMinute = 0;
        this.scheduleHour = 0;
        this.scheduleDayOfWeek = null
        this.scheduleMonth = null;
        this.scheduleDayOfMonth = 0;
        this.repeateCount = 0;
        this.status = null;
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