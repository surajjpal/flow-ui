export class USPSearchRequest {
    dataIngestorName: string;
    dataIngestorDocType: string;
    searchText: string;
    size: number;
    highlight: any[];
    scrollId: string;
    maxScore: number;
    sort: any;
    createdDtFilter: any;
    companyContext = {}

    constructor(dataIngestorName?: string, dataIngestorDocType?: string, 
        searchText?: string, size?: number, highlight?: any[], 
        scrollId?: string, maxScore?: number, sort?: any, createdDtFilter?: any) {

        this.dataIngestorDocType = dataIngestorDocType ? dataIngestorName : null;
        this.dataIngestorDocType = dataIngestorDocType ? dataIngestorDocType : null;
        this.searchText = searchText ? searchText : null;
        this.size = size ? size : 10;
        this.highlight = highlight ? highlight : [];
        this.scrollId = scrollId ? scrollId : null;
        this.maxScore = maxScore ? maxScore : 0;
        this.sort = sort ? sort : {};
        this.createdDtFilter = createdDtFilter ? createdDtFilter : {};
    }
}

export class USPSearchResult {
    result: USPSearchResultData[];
    scrollId: string;

    constructor(result?: USPSearchResultData[], scrollId?: string) {
        this.result = result ? result : [];
        this.scrollId = scrollId ? scrollId : null;
    }
}

export class USPSearchResultData {
    data: any;
    highlight: any;
    maxScore: number;
    relevant: string;

    constructor(data?: any, highlight?: any, maxScore?: number, relevant?: string) {
        this.data = data ? data : {};
        this.highlight = highlight ? highlight : {};
        this.maxScore = maxScore ? maxScore : 0;
        this.relevant = relevant ? relevant : '';
    }
    
}