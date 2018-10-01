import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ConversationService } from '../../../../services/agent.service';
import { Episode, ChatMessage, EpisodeContext } from '../../../../models/conversation.model';
import { UniversalUser } from '../../../../services/shared.service';

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
  private subscription: Subscription;

  constructor(
    private conversationService: ConversationService,
    private universalUser: UniversalUser
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

    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionBargeIn && !this.subscriptionBargeIn.closed) {
      this.subscriptionBargeIn.unsubscribe();
    }
  }

  onEpisodeSelect(selectedEpisode: Episode): void {
    this.selectedEpisode = selectedEpisode;
    this.chatMessageList = [];

    this.subscription = this.conversationService.getChat(selectedEpisode._id)
      .subscribe(
        chatMessageList => {
          if (chatMessageList) {
            chatMessageList.reverse();    // To get latest message at bottom of screen
            this.chatMessageList = chatMessageList;
          }
        }
      );
  }

  loadMore() {

  }

  getClassIfEpisodeSelected(episode: Episode) {
    return episode && this.selectedEpisode && episode === this.selectedEpisode ? "active" : "";
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

  getEpisodesApplicableForBargeIn() {
    if (!this.fetchBargeInEpisode) {
      return;
    }

    if (this.subscriptionBargeIn && !this.subscriptionBargeIn.closed) {
      this.subscriptionBargeIn.unsubscribe();
    }

    this.subscriptionBargeIn = this.conversationService.getEpisodesForBargeIn(2)
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
    this.episodeCountData = [];
    const label = 'Episodes needs to be barged in';
    const data = [];
    if (this.episodeList) {
      for (const episode of this.episodeList) {
        const temp = {
          'label': episode._id,
          'value': episode.episodeContext.missedExpressionCount,
          'episodeId': episode._id
        };

        data.push(temp);

        if (episode.alreadyBargedIn && episode.bargedInAgentId && episode.alreadyBargedIn === true && episode.bargedInAgentId === this.universalUser.getUser()._id) {
          this.selectedEpisode = episode;
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
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 50,
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
            elementClick: function (e) {
              console.log("! element Click !");
              console.log(e.data);
            }
          }
        },
        duration: 500,
        xAxis: {
          axisLabel: 'Episode Timeline (Latest to Oldest Episode)'
        },
        yAxis: {
          axisLabel: 'Missed Expession Count',
          axisLabelDistance: -10
        }
      }
    };

    /*dummy_graph_data = [
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
    ];*/
  }
}