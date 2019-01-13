export class BaseModel {
  _id: string;
  statusCd: string;
  companyId: string;
  subStatus:string;
  // companyName: string;

  constructor() {
    this._id = null;
    this.statusCd = null;
    this.subStatus = null;
    this.companyId = null;
    // this.companyName = "";
  }
}
