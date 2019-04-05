import { BaseModel } from './base.model';
import { FieldTypes } from './constants';
export class DataModel extends BaseModel{
    label: string;
    name: string;
    fields: Field[];
    version:number;
    process:string;
    locked:boolean;
    validators: ValidatorInstance[];

  constructor() {
    super();

    this.label = '';
    this.name = '';
    this.fields = [];
    this.version = 0;
    this.process = '';
    this.validators = [];
    this.locked = false;
  }
}

export class Field{
    label:string;
    name:string;
    validators:ValidatorInstance[];
    extractors:ExtractorInstance[];
    modelName:string;
    locked:boolean;
    type:FieldTypes;
    list:boolean;
    sortOrder:number;
    value:any;

    constructor(){
        this.label = '';
        this.name = '';
        this.validators = [];
        this.extractors = [];
        this.modelName = '';
        this.list = false;
        this.sortOrder = 0;
        this.locked = false;
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