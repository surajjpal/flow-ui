export class BaseModel {
  _id: string;
  statusCd: string;
  companyId: string;

  constructor() {
    this._id = null;
    this.statusCd = null;
    this.companyId = null;
  }
}