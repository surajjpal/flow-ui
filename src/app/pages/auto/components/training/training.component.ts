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

  constructor(
    private trainingService: TrainingService,
    private slimLoadingBarService: SlimLoadingBarService
  ) {
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
    this.trainingService.getTrainingData()
      .then(
      trainingDataList => {
        if (trainingDataList) {
          this.trainingDataList = trainingDataList;
        }
      },
      error => {

      }
      )
      .catch(
      error => {

      }
      );
  }

  toInt(num: string) {
    return +num;
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
}
