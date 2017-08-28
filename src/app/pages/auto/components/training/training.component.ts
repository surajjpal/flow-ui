import { Component, OnInit } from '@angular/core';

import { TrainingService } from '../../auto.service';
import { TrainingData } from '../../auto.model';

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

  constructor(
    private trainingService: TrainingService
  ) {
    this.trainingDataList = [];
    this.selectedTrainingData = new TrainingData();
    this.filterQuery = '';
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
}
