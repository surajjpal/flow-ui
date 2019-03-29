import { BaseModel } from './base.model';
import { FieldTypes } from './constants';
export class DataModel extends BaseModel{
    label: string;
    name: string;
    fields: Field[];
    validators: ValidatorInstance[];

  constructor() {
    super();

    this.label = '';
    this.name = '';
    this.fields = [];
    this.validators = [];
  }
}

export class Field{
    label:string;
    name:string;
    validators:ValidatorInstance[];
    extractors:ExtractorInstance[];
    modelName:string;
    type:FieldTypes;
    list:boolean;
    sortOrder:number;

    constructor(){
        this.label = '';
        this.name = '';
        this.validators = [];
        this.extractors = [];
        this.modelName = '';
        this.list = false;
        this.sortOrder = 0;
    }
}

export class ValidatorInstance{
    name:string;
    params:any;
    constructor(){
        this.name = "";
        this.params = {};
    }
}

export class ExtractorInstance{
    name:string;
    params:any;
    constructor(){
        this.name = "";
        this.params = {};
    }
}