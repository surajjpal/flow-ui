declare var closeModal: any;

import { Component, OnInit } from '@angular/core';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { IntentService } from '../../auto.service';
import { IntentData } from '../../auto.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'api-intent',
  templateUrl: './intent.component.html',
  styleUrls: ['./intent.scss']
})
export class IntentComponent implements OnInit {

  intentList: IntentData[];
  selectedIntent: IntentData;
  filterQuery: string;

  loading: boolean;
  createMode: boolean;
  modalHeader: string;

  constructor(
    private intentService: IntentService
  ) {
    this.loading = false;
    this.modalHeader = '';

    this.intentList = [];
    this.selectedIntent = new IntentData();
    this.filterQuery = '';
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.intentService.fetchData()
      .then(
      intentList => {
        this.loading = false;
        if (intentList) {
          this.intentList = intentList;
        }
      },
      error => {
        this.loading = false;
      }
      )
      .catch(
      error => {
        this.loading = false;
      }
      );
  }

  arrayToString(array: string[]) {
    let arrayString: string = '';
    for (let i = 0, len = array.length; i < len; i++) {
      arrayString += array[i];

      if (i < (len - 1)) {
        arrayString += ', ';
      }
    }

    return arrayString;
  }

  onSelect(intentData: IntentData) {
    if (intentData) {
      this.createMode = false;
      this.modalHeader = 'Edit Intent Data';
      this.selectedIntent = JSON.parse(JSON.stringify(intentData));
    } else {
      this.createMode = true;
      this.modalHeader = 'Create Intent Data';
      this.selectedIntent = new IntentData();
    }
  }

  createRecord() {
    this.loading = true;
    this.intentService.createData(this.selectedIntent)
      .then(
      trainingData => {
        new closeModal('detailsModal');
        this.fetchData();
      },
      error => {
        this.loading = false;
      }
      )
      .catch(
      error => {
        this.loading = false;
      }
      );
  }

  updateRecord() {
    this.loading = true;
    this.intentService.updateData(this.selectedIntent)
      .then(
      trainingData => {
        new closeModal('detailsModal');
        this.fetchData();
      },
      error => {
        this.loading = false;
      }
      )
      .catch(
      error => {
        this.loading = false;
      }
      );
  }

  deleteRecord() {
    this.loading = true;
    this.intentService.deleteData(this.selectedIntent.intent)
      .then(
      trainingData => {
        new closeModal('detailsModal');
        this.fetchData();
      },
      error => {
        this.loading = false;
      }
      )
      .catch(
      error => {
        this.loading = false;
      }
      );
  }
}
