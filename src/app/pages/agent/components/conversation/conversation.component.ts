import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ConversationService } from '../../../../services/agent.service';
import { Episode, ChatMessage, EpisodeContext } from '../../../../models/conversation.model';
import { UniversalUser } from '../../../../services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';

declare let d3: any;
declare let moment: any;

@Component({
  selector: 'api-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {
  searchQuery: string;
  episodeList: Episode[];
  selectedEpisode: Episode;
  chatMessageList: ChatMessage[];
  loading;
  fetchBargeInEpisode: boolean = true;

  episodeCountOptions;
  episodeCountData;

  private subscriptionBargeIn: Subscription;
  private subscriptionChatMessages: Subscription;
  private subscriptionEpisodeDetails: Subscription;

  constructor(
    private conversationService: ConversationService,
    private universalUser: UniversalUser,
    private sanitizer: DomSanitizer
  ) {
    this.searchQuery = '';
    this.loading = false;
    this.episodeList = [];
    this.selectedEpisode = new Episode();
    this.chatMessageList = [];
  }

  ngOnInit() {
    this.getEpisodesApplicableForBargeIn();
    this.populateChartOptions();
    this.transformEpisodeIntoGraph();
  }

  ngOnDestroy(): void {
    this.fetchBargeInEpisode = false;

    if (this.subscriptionChatMessages && !this.subscriptionChatMessages.closed) {
      this.subscriptionChatMessages.unsubscribe();
    }
    if (this.subscriptionEpisodeDetails && !this.subscriptionEpisodeDetails.closed) {
      this.subscriptionEpisodeDetails.unsubscribe();
    }
    if (this.subscriptionBargeIn && !this.subscriptionBargeIn.closed) {
      this.subscriptionBargeIn.unsubscribe();
    }
  }

  getEpisodesApplicableForBargeIn() {
    if (!this.fetchBargeInEpisode) {
      return;
    }

    if (this.subscriptionBargeIn && !this.subscriptionBargeIn.closed) {
      this.subscriptionBargeIn.unsubscribe();
    }

    this.subscriptionBargeIn = this.conversationService.getEpisodesForBargeIn(1)
      .subscribe(
        episodeList => {
          if (episodeList) {
            this.episodeList = episodeList;
            this.transformEpisodeIntoGraph();
          }

          setTimeout(() => {
            this.getEpisodesApplicableForBargeIn();
          }, 20000);
        },
        error => {
          // Do something with it

          setTimeout(() => {
            this.getEpisodesApplicableForBargeIn();
          }, 20000);
        }
      );
  }

  transformEpisodeIntoGraph() {
    const label = 'Episodes needs to be barged in';
    const data = [];
    if (this.episodeList) {
      let index = 1;
      for (const episode of this.episodeList) {
        const temp = {
          'label': episode._id,
          'value': episode.episodeContext.missedExpressionCount,
          'episodeId': episode._id,
          'index': index
        };

        data.push(temp);
        index++;

        if (episode.alreadyBargedIn && episode.bargedInAgentId && episode.alreadyBargedIn === true && episode.bargedInAgentId === this.universalUser.getUser()._id) {
          if (!this.selectedEpisode || this.selectedEpisode === null) {
            this.selectedEpisode = episode;
            this.showEpisodeDetails(episode._id);
            this.getChatMessages();
          }
        }
      }
    }

    this.episodeCountData = [
      {
        key: label,
        values: data
      }
    ];
  }

  populateChartOptions() {
    this.episodeCountOptions = {
      chart: {
        type: 'discreteBarChart',
        height: 200,
        margin: {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: function (d) { return d.index; },
        y: function (d) { return d.value; },
        showValues: true,
        valueFormat: function (d) {
          return d3.format(',.4f')(d);
        },
        color: ((d) => {
          if (this.selectedEpisode && this.selectedEpisode !== null && d.episodeId === this.selectedEpisode._id) {
            return 'blue';
          } else if (d.value > 2) {
            return 'red';
          } else if (d.value > 0 && d.value <= 2) {
            return 'yellow';
          } else {
            return 'green';
          }
        }),
        discretebar: {
          dispatch: {
            elementClick: ((e) => {
              console.log("! element Click !");
              console.log(e);
              if (!this.selectedEpisode || this.selectedEpisode === null || this.selectedEpisode._id || this.selectedEpisode._id === null || this.selectedEpisode._id !== e.data.episodeId) {
                this.selectedEpisode = new Episode();
                this.selectedEpisode._id = e.data.episodeId;
                this.transformEpisodeIntoGraph();
                this.showEpisodeDetails(e.data.episodeId);
                this.getChatMessages();
              }
            })
          }
        },
        duration: 500,
        xAxis: {
          axisLabel: 'Episode Timeline (Latest to Oldest Episode)',
        },
        yAxis: {
          axisLabel: 'Missed Expession Count',
          axisLabelDistance: -10
        }
      }
    };

    /*
    dummy_graph_options = {
      chart: {
        type: 'discreteBarChart',
        height: 600,
        margin: {
          top: 20,
          right: 20,
          bottom: 200,
          left: 55
        },
        x: function (d) { return d.label; },
        y: function (d) { return d.value; },
        showValues: true,
        valueFormat: function (d) {
          return d3.format(',.4f')(d);
        },
        color: ((d) => {
          if (this.selectedEpisode && this.selectedEpisode !== null && d.episodeId === this.selectedEpisode._id) {
            return 'blue';
          } else if (d.value > 2) {
            return 'red';
          } else if (d.value > 0 && d.value <= 2) {
            return 'yellow';
          } else {
            return 'green';
          }
        }),
        discretebar: {
          dispatch: {
            elementClick: ((e) => {
              console.log("! element Click !");
              console.log(e);
              if (!this.selectedEpisode || this.selectedEpisode === null || this.selectedEpisode._id || this.selectedEpisode._id === null || this.selectedEpisode._id !== e.data.episodeId) {
                this.selectedEpisode = new Episode();
                this.selectedEpisode._id = e.data.episodeId;
                this.transformEpisodeIntoGraph();
                this.showEpisodeDetails(e.data.episodeId);
                this.getChatMessages();
              }
            })
          }
        },
        duration: 500,
        xAxis: {
          axisLabel: 'Episode Timeline (Latest to Oldest Episode)',
          rotateLabels: -90
        },
        yAxis: {
          axisLabel: 'Missed Expession Count',
          axisLabelDistance: -10
        }
      }
    };
    dummy_graph_data = [
      {
        key: "Cumulative Return",
        values: [
          {
            "label": "A",
            "value": -29.765957771107
          },
          {
            "label": "B",
            "value": 0
          },
          {
            "label": "C",
            "value": 32.807804682612
          },
          {
            "label": "D",
            "value": 196.45946739256
          },
          {
            "label": "E",
            "value": 0.19434030906893
          },
          {
            "label": "F",
            "value": -98.079782601442
          },
          {
            "label": "G",
            "value": -13.925743130903
          },
          {
            "label": "H",
            "value": -5.1387322875705
          }
        ]
      }
    ];
    */
  }

  showEpisodeDetails(episodeId: string) {
    this.subscriptionEpisodeDetails = this.conversationService.getEpisode(episodeId)
    .subscribe(episode => {
      if (episode) {
        this.selectedEpisode = episode;
        this.getChatMessages();
      }
    });
  }

  getChatMessages() {
    this.subscriptionChatMessages = this.conversationService.getChat(this.selectedEpisode._id)
    .subscribe(chatMessages => {
      if (chatMessages) {
        this.chatMessageList = chatMessages;
      }
    });
  }

  getSafeHTML(inlineHtml: string) {
    if (inlineHtml) {
      return this.sanitizer.bypassSecurityTrustHtml(inlineHtml);
    }
    return '';
  }

  hasUserAlreadyBargedIn() {
    return false;
  }

  bargeIn() {
    
  }
}