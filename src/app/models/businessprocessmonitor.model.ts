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

export class BusinessProcessMonitorCountPercentageChange {
    dataPointName: string;
    dataPointLabel: string;
    count: number;
    percentageChange: number;

    constructor(dataPointName?: string, dataPointLabel?: string, count?: number, percentageChange?: number) {
        this.dataPointName = dataPointLabel ? dataPointName : '';
        this.dataPointLabel = dataPointLabel ? dataPointLabel : '';
        this.count = count ? count: 0;
        this.percentageChange = percentageChange ? percentageChange : 0;

    }
}

export class BusinessProcessMonitorGraphData {
    result = [];
    dataPointName: string;
    dataPointLabel: string;
    options: any;

    constructor(dataPointName?: string, dataPointLabel?: string) {
        this.dataPointName = dataPointName ? dataPointName : '';
        this.dataPointLabel = dataPointLabel ? dataPointLabel : '';
        this.options = null;
    }
}