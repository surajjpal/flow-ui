export class BusinessProcessMonitorRequest {
    machineType: string;
    flowStatus: string;
    dataPoints = {};
    startTime: Date;
    endTime: Date;

    constructor(machineType?: string, flowStatus?: string, startTime?: Date, endTime?: Date) {
        this.machineType = machineType ? machineType : null;
        this.flowStatus = flowStatus ? flowStatus : null;
        this.dataPoints = {}
        this.startTime = startTime ? startTime : null;
        this.endTime = endTime ? endTime : null;
    }
}