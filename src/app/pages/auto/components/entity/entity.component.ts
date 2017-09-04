declare var closeModal: any;

import { Component, OnInit } from '@angular/core';

import { EntityService } from '../../auto.service';
import { EntityData } from '../../auto.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'api-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.scss']
})
export class EntityComponent implements OnInit {

  entityList: EntityData[];
  selectedEntity: EntityData;
  filterQuery: string;

  loading: boolean;
  createMode: boolean;
  modalHeader: string;

  constructor(
    private entityService: EntityService
  ) {
    this.loading = false;
    this.modalHeader = '';

    this.entityList = [];
    this.selectedEntity = new EntityData();
    this.filterQuery = '';
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.entityService.fetchData()
      .then(
        entityList => {
          this.loading = false;
          if (entityList) {
            this.entityList = entityList;
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

  onSelect(entityData: EntityData) {
    if (entityData) {
      this.createMode = false;
      this.modalHeader = 'Edit Entity Data';
      this.selectedEntity = JSON.parse(JSON.stringify(entityData));
    } else {
      this.createMode = true;
      this.modalHeader = 'Create Entity Data';
      this.selectedEntity = new EntityData();
    }
  }

  createRecord() {
    this.loading = true;
    this.entityService.createData(this.selectedEntity)
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
    this.entityService.updateData(this.selectedEntity)
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
    this.entityService.deleteData(this.selectedEntity.intent) // change intent to entity once API is ready
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
