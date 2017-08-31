declare var closeModal: any;

import { Component, OnInit } from '@angular/core';
import { NgUploaderOptions } from 'ngx-uploader';

import { TrainingService } from '../../auto.service';
import { TrainingData } from '../../auto.model';
import { environment } from '../../../../../environments/environment';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

declare let moment: any;

@Component({
  selector: 'api-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.scss']
})
export class TrainingComponent implements OnInit {

  trainingDataList: TrainingData[];
  filterQuery: string;
  selectedTrainingData: TrainingData;
  fileUploaderOptions: NgUploaderOptions;

  loading: boolean;

  createMode: boolean;
  modalHeader: string;

  constructor(
    private trainingService: TrainingService,
    private slimLoadingBarService: SlimLoadingBarService
  ) {
    this.loading = false;
    this.modalHeader = '';

    this.trainingDataList = [];
    this.selectedTrainingData = new TrainingData();
    this.filterQuery = '';

    const uploadUrl = `${environment.autoServer}${environment.uploadtrainingexcelurl}`;
    this.fileUploaderOptions = {
      url: uploadUrl,
    };

    this.slimLoadingBarService.color = '#2DACD1'; // Primary color
    this.slimLoadingBarService.height = '4px';
  }

  ngOnInit() {
    this.fetchTrainingData();
  }

  toInt(num: string) {
    return +num;
  }

  arrayToString(array: string[]) {
    return array.toString();
  }

  fetchTrainingData() {
    this.loading = true;
    this.trainingService.getTrainingData()
    .then(
    trainingDataList => {
      if (this.loading) {
        this.loading = false;
      }
      if (trainingDataList) {
        this.trainingDataList = trainingDataList;
      }
    },
    error => {
      this.loading = false;
      if (this.loading) {
        this.loading = false;
      }
    }
    )
    .catch(
    error => {
      this.loading = false;
      if (this.loading) {
        this.loading = false;
      }
    }
    );
  }

  onFileUpload(event: any) {
    if (event && event.hasOwnProperty('progress') && event['progress'].hasOwnProperty('percent')) {
      const percent = (event['progress'])['percent'];
      if (percent) {
        if (percent < 100) {
          this.slimLoadingBarService.progress = percent;
        } else {
          this.slimLoadingBarService.complete();
        }
      }
    }
  }

  onFileUploadComplete(event: any) {
    this.slimLoadingBarService.complete();
  }

  onSelect(selectedTrainingData: TrainingData) {
    if (selectedTrainingData) {
      this.createMode = false;
      this.modalHeader = 'Edit Training Data';
      this.selectedTrainingData = JSON.parse(JSON.stringify(selectedTrainingData));
    } else {
      this.createMode = true;
      this.modalHeader = 'Create Training Data';
      this.selectedTrainingData = new TrainingData();
    }
  }

  createRecord() {
    this.loading = true;
    this.selectedTrainingData.id = null;
    this.trainingService.create(this.selectedTrainingData)
    .then(
      trainingData => {
        new closeModal('detailsModal');
        this.fetchTrainingData();
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
    this.trainingService.update(this.selectedTrainingData)
    .then(
      trainingData => {
        new closeModal('detailsModal');
        this.fetchTrainingData();
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
    this.trainingService.delete(this.selectedTrainingData.id)
    .then(
      trainingData => {
        new closeModal('detailsModal');
        this.fetchTrainingData();
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
