import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

import { Subject } from "rxjs/Subject";
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { UniversalUser } from './shared.service'
import { DataModel } from "../models/dataModel.model";
import { Router } from "@angular/router";

@Injectable()
export class DataModelService {

	private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

	constructor(private router: Router, private httpClient: HttpClient) { }

	create(dataModel: DataModel): Observable<DataModel> {
		const subject = new Subject<DataModel>();
		const url = `${environment.server + environment.dataModelUrl}`;

		if (dataModel) {
			this.httpClient.post<DataModel>(
				url,
				dataModel,
				{
					headers: this.httpHeaders,
					observe: 'response',
					reportProgress: true,
					withCredentials: true
				}
			).subscribe(
				(response: HttpResponse<DataModel>) => {
					if (response.body) {
						subject.next(response.body);
					}
				},
				(err: HttpErrorResponse) => {
					subject.error(err);
				}
			);
		} else {
			subject.error('Object is null or invalid');
		}
		return subject.asObservable();
	}

	update(dataModel: DataModel): Observable<DataModel> {
		const subject = new Subject<DataModel>();
		const url = `${environment.server + environment.dataModelUrl}`;

		if (dataModel) {
			this.httpClient.put<DataModel>(
				url,
				dataModel,
				{
					headers: this.httpHeaders,
					observe: 'response',
					reportProgress: true,
					withCredentials: true
				}
			).subscribe(
				(response: HttpResponse<DataModel>) => {
					if (response.body) {
						subject.next(response.body);
					}
				},
				(err: HttpErrorResponse) => {
					subject.error(err);
				}
			);
		} else {
			subject.error('Object is null or invalid');
		}
		return subject.asObservable();
	}

	delete(dataModel: DataModel): Observable<any> {
		const subject = new Subject<any>();

		if (dataModel && dataModel._id && dataModel._id.length > 0) {
			const url = `${environment.server + environment.dataModelUrl + dataModel._id}`;

			this.httpClient.delete<any>(
				url,
				{
					observe: 'response',
					reportProgress: true,

					withCredentials: true
				}
			)
				.subscribe(
					(response: HttpResponse<any>) => {
						subject.next(response);
					},
					(err: HttpErrorResponse) => {
						subject.error(err);
					}
				);
		} else {
			subject.error('Object is null or invalid');
		}

		return subject.asObservable();
	}

	getAllDataModels(): Observable<DataModel[]> {
		const subject = new Subject<DataModel[]>();

		const url = `${environment.server + environment.dataModelUrl}`;

		this.httpClient.get<DataModel[]>(
			url,
			{
				observe: 'response',
				reportProgress: true,
				withCredentials: true
			}
		)
			.subscribe(
				(response: HttpResponse<DataModel[]>) => {
					if (response.body) {
						subject.next(response.body);
					}
				},
				(err: HttpErrorResponse) => {
					subject.error(err);
				}
			);

		return subject.asObservable();
	}

	getFieldTypes(): Observable<string[]> {
		const subject = new Subject<string[]>();

		const url = `${environment.server + environment.fieldTypesUrl}`;

		this.httpClient.get<string[]>(
			url,
			{
				observe: 'response',
				reportProgress: true,
				withCredentials: true
			}
		)
			.subscribe(
				(response: HttpResponse<string[]>) => {
					if (response.body) {
						subject.next(response.body);
					}
				},
				(err: HttpErrorResponse) => {
					subject.error(err);
				}
			);

		return subject.asObservable();
	}
}