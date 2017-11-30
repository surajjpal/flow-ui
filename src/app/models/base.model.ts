export class BaseModel {
  _id: string;
  statusCd: string;
  companyId: string;
  operationType: string;

  constructor() {
    this._id = null;
    this.statusCd = null;
    this.companyId = null;
    this.operationType = null;
  }
}
