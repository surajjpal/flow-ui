import { DataPoint } from "app/models/flow.model";

export class BusinessProcessMonitorRequest {

    companyId: string;
    machineType: string;
    flowStatus: string;
    selectedDataPointConfiguration: DataPoint;
    dataPointConfigurations: DataPoint[];
    machineIds: string[]
    dataPoints = {};
    startTime: Date;
    endTime: Date;

    constructor(machineType?: string, flowStatus?: string,selectedDataPointConfiguration?: DataPoint, dataPointConfigurations?: DataPoint[], machineIds?: string[], startTime?: Date, endTime?: Date) {
        this.machineType = machineType ? machineType : null;
        this.flowStatus = flowStatus ? flowStatus : null;
        this.selectedDataPointConfiguration = selectedDataPointConfiguration ? selectedDataPointConfiguration : null;
        this.dataPointConfigurations = dataPointConfigurations ? dataPointConfigurations : [];
        this.machineIds = machineIds ? machineIds : [];
        this.dataPoints = {}
        this.startTime = startTime ? startTime : null;
        this.endTime = endTime ? endTime : null;
    }
}

export class OnDemandReportRequest {

    companyId: string;
    machineType: string;
    toAddress:string;
    startDate: Date;
    endDate: Date;

    constructor(machineType?: string,  toAddress?: string,startDate?: Date, endDate?: Date) {
        this.machineType = machineType ? machineType : null;
        this.toAddress = toAddress ? toAddress : "";
        this.startDate = startDate ? startDate : null;
        this.endDate = endDate ? endDate : null;
    }
}

export class BusinessProcessMonitorCountPercentageChange {
    dataPointName: string;
    dataPointLabel: string;
    count: number;
    percentageChange: number;
    sequence: number;

    constructor(dataPointName?: string, dataPointLabel?: string, count?: number, percentageChange?: number, sequence?: number) {
        this.dataPointName = dataPointLabel ? dataPointName : '';
        this.dataPointLabel = dataPointLabel ? dataPointLabel : '';
        this.count = count ? count: 0;
        this.percentageChange = percentageChange ? percentageChange : 0;
        this.sequence = this.sequence ? sequence : 1;
    }
}

export class BusinessProcessMonitorGraphData {
    result = [];
    dataPointName: string;
    dataPointLabel: string;
    options: any;
    sequence: number;

    constructor(dataPointName?: string, dataPointLabel?: string) {
        this.dataPointName = dataPointName ? dataPointName : '';
        this.dataPointLabel = dataPointLabel ? dataPointLabel : '';
        this.options = null;
        this.sequence = 1;
    }
}