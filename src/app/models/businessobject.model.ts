export class BusinessObject {
    _id: string;
    code: string;
    displayName: string;
    algorithmCategory: string;
    algorithms: BusinessObjectAlgorithm[]; // { algorithmId : "", configparams : {}, algorithmScore: {trainingVersion: version, precision_score: []} }
    selfTrain: boolean;
    training: Training[]; // { version: "", status : "", inputLabels: ""}

    constructor(code?: string, displayName?: string, algorithmCategory?: string, algorithms?: BusinessObjectAlgorithm[], selfTrain?: boolean, training?: Training[]) {
        this.code = code ? code : '';
        this.displayName = displayName ? displayName : '';
        this.algorithmCategory = algorithmCategory ? algorithmCategory : '';
        this.algorithms = algorithms? algorithms : [];
        this.selfTrain = selfTrain? selfTrain : false;
        this.training = training? training : [];
    }
}

export class Training {
    version: string;
    status: string;
    inputLabels: string[];
    outputLabels: string[];

    constructor(version?: string, status?: string, inputLabels?: string[], outputLabels?: string[]) {
        this.version = version ? version : '';
        this.status = status ? status : '';
        this.inputLabels = inputLabels ? inputLabels : [];
        this.outputLabels = outputLabels ? outputLabels : [];
    }
}

export class BusinessObjectAlgorithm {
    algorithmId: string;
    configParametrs: {};
    algorithmScore: {};

    constructor(algorithmId?: string) {
        this.algorithmId = '';
        this.configParametrs = {};
        this.algorithmScore = {};
    }
}

export class Algorithm {
    _id: string;
    name: string;
    category: string;
    configParameters: {};

    constructor() {
        this._id = '';
        this
    }
}