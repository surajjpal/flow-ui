export class CRUDOperationInput {
    operation: string;
    collection: string;
    payload: any;
    fields: any;
    page: number;
    pageSize: number;
}