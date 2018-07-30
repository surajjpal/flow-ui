import { BaseModel } from './base.model';

export class Field extends BaseModel {
    name: string;
    label: string;
    validators: string[];
    extractors: string[];
    type: string;
    dataModelId: string;
    list: boolean;
    sortOrder: number;
}

export class DataModel extends BaseModel {
    name: string;
    lablel: string;
    fields: Field[];
}