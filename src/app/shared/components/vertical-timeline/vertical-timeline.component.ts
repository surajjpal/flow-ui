import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TimelineStateAuditData, Document } from 'app/models/tasks.model';
import { environment } from 'environments/environment';

declare let moment: any;

@Component({
  selector: 'api-vertical-timeline',
  templateUrl: './vertical-timeline.component.html'
})
export class VerticalTimelineComponent implements OnInit {

    @Input()
    timeLineStateAuditData: TimelineStateAuditData[];

    constructor() {
      this.timeLineStateAuditData = [];
    }

    ngOnInit() {
        
    }

    getDownloadUrl(document: Document) {
      if (document && document.downloadFileUrl) {
        return environment.interfaceService + document.downloadFileUrl;
      }
      return null;
    }
}