import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { ConversationService } from '../../../../services/agent.service';
import { Episode, ChatMessage, EpisodeContext } from '../../../../models/conversation.model';
import { UniversalUser, ScrollService } from '../../../../services/shared.service';
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
  agentMessage: string;
  episodeList: Episode[];
  selectedEpisode: Episode;
  chatMessageList: ChatMessage[];
  loading;
  pollBargeInEpisode: boolean = true;
  pollEpisodeChat: boolean = true;
  episodePollingFrequency = 20000;
  chatPollingFrequency = 3000;
  fetchingEpisodeDetails: boolean = false;
  fetchingEpisodeChat: boolean = false;

  episodeCountOptions;
  episodeCountData;

  private subscriptionBargeIn: Subscription;
  private subscriptionChatMessages: Subscription;
  private subscriptionEpisodeDetails: Subscription;
  private subscriptionSaveEpisode: Subscription;
  private subscriptionSendAgentMessage: Subscription;

  constructor(
    private conversationService: ConversationService,
    private universalUser: UniversalUser,
    private sanitizer: DomSanitizer,
    private scrollService: ScrollService,
    private route: ActivatedRoute,
  ) {
    this.searchQuery = '';
    this.agentMessage = '';
    this.loading = false;
    this.episodeList = [];
    this.selectedEpisode = null;
    this.chatMessageList = [];
  }

  ngOnInit() {
    const episodeId = this.route.snapshot.paramMap.get('episodeId');
    if (episodeId) {
      //this.getEpisode(episodeId);
      this.showEpisodeDetails(episodeId, true);
      this.populateChartOptions();
      this.transformEpisodeIntoGraph();
    }
    else {
      this.getEpisodesApplicableForBargeIn();
      this.populateChartOptions();
      this.transformEpisodeIntoGraph();
    }
    
  }

  ngOnDestroy(): void {
    this.pollBargeInEpisode = false;
    this.pollEpisodeChat = false;

    if (this.subscriptionChatMessages && !this.subscriptionChatMessages.closed) {
      this.subscriptionChatMessages.unsubscribe();
    }
    if (this.subscriptionEpisodeDetails && !this.subscriptionEpisodeDetails.closed) {
      this.subscriptionEpisodeDetails.unsubscribe();
    }
    if (this.subscriptionBargeIn && !this.subscriptionBargeIn.closed) {
      this.subscriptionBargeIn.unsubscribe();
    }
    if (this.subscriptionSaveEpisode && !this.subscriptionSaveEpisode.closed) {
      this.subscriptionSaveEpisode.unsubscribe();
    }
    if (this.subscriptionSendAgentMessage && !this.subscriptionSendAgentMessage.closed) {
      this.subscriptionSendAgentMessage.unsubscribe();
    }
  }

  getEpisode(episodeId: string) {
    this.subscriptionBargeIn = this.conversationService.getEpisode(episodeId)
      .subscribe(
        episode => {
          this.selectedEpisode = episode;
        },
        error => {
          console.log("episode not found");
        }
      )
  }

  getEpisodesApplicableForBargeIn(existingEpisode?: boolean) {
    if (!this.pollBargeInEpisode) {
      return;
    }

    if (this.subscriptionBargeIn && !this.subscriptionBargeIn.closed) {
      this.subscriptionBargeIn.unsubscribe();
    }

    this.subscriptionBargeIn = this.conversationService.getEpisodesForBargeIn(1)
      .subscribe(
        episodeList => {
          if (episodeList) {
            if (existingEpisode) {
              episodeList.push(this.selectedEpisode);
            }
            this.episodeList = episodeList;
            this.transformEpisodeIntoGraph();
          }

          setTimeout(() => {
            this.getEpisodesApplicableForBargeIn();
          }, this.episodePollingFrequency);
        },
        error => {
          // Do something with it

          setTimeout(() => {
            this.getEpisodesApplicableForBargeIn();
          }, this.episodePollingFrequency);
        }
      );
  }

  transformEpisodeIntoGraph() {
    const label = 'Episodes needs to be barged in';
    const data = [];
    if (this.episodeList) {
      let index = 1;
      let selectedEpisodePresentInList = false;

      for (const episode of this.episodeList) {
        if (!selectedEpisodePresentInList) {
          selectedEpisodePresentInList = this.selectedEpisode && this.selectedEpisode._id && episode && episode._id && this.selectedEpisode._id === episode._id;
        }
        
        const temp = {
          'label': episode._id,
          'value': episode.episodeContext.missedExpressionCount,
          'episodeId': episode._id,
          'index': index
        };

        data.push(temp);
        index++;

        if (episode.bargedIn && episode.bargedInAgentId && episode.bargedIn === true && episode.bargedInAgentId === this.universalUser.getUser()._id) {
          if (!this.selectedEpisode || this.selectedEpisode === null) {
            this.selectedEpisode = episode;
            this.showEpisodeDetails(episode._id);
            this.getChatMessages(true);
          }
        } else {
          if (this.selectedEpisode && this.selectedEpisode._id && episode && episode._id && this.selectedEpisode._id === episode._id && this.selectedEpisode.bargedIn && this.selectedEpisode.bargedInAgentId === this.universalUser.getUser()._id) {
            episode.bargedIn = this.selectedEpisode.bargedIn;
            episode.bargedInAgentId = this.selectedEpisode.bargedInAgentId;
          }
        }
      }

      if (!selectedEpisodePresentInList) {
        this.selectedEpisode = null;
        this.chatMessageList = [];
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
          return d;
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
              if (!this.selectedEpisode || this.selectedEpisode === null || this.selectedEpisode._id || this.selectedEpisode._id === null || this.selectedEpisode._id !== e.data.episodeId) {
                if (!this.selectedEpisode || this.selectedEpisode === null) {
                  this.selectedEpisode = new Episode();
                }
                this.selectedEpisode._id = e.data.episodeId;
                this.transformEpisodeIntoGraph();
                this.showEpisodeDetails(e.data.episodeId);
                this.getChatMessages(true);
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
              if (!this.selectedEpisode || this.selectedEpisode === null || this.selectedEpisode._id || this.selectedEpisode._id === null || this.selectedEpisode._id !== e.data.episodeId) {
                this.selectedEpisode = new Episode();
                this.selectedEpisode._id = e.data.episodeId;
                this.transformEpisodeIntoGraph();
                this.showEpisodeDetails(e.data.episodeId);
                this.getChatMessages(true);
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

  showEpisodeDetails(episodeId: string, viewMode?: boolean) {
    this.fetchingEpisodeDetails = true;
    this.subscriptionEpisodeDetails = this.conversationService.getEpisode(episodeId)
      .subscribe(
        episode => {
          if (episode) {
            this.selectedEpisode = episode;
            if (viewMode) {
              this.getChatMessages();
              this.getEpisodesApplicableForBargeIn(true);
              
            }
            else {
              if (this.bargedIntoSelectedEpisode()) {
                this.pollEpisodeChat = true;
                this.getChatMessages();
              } else {
                this.pollEpisodeChat = false;
              }
            }
          }

          this.scrollToView('episodeDetailsCard');
          this.fetchingEpisodeDetails = false;
        },
        error => {
          // Do something with it
          this.fetchingEpisodeDetails = false;
        }
      );
  }

  getChatMessages(disableAgentInput?: boolean) {
    if (this.subscriptionChatMessages && !this.subscriptionChatMessages.closed) {
      this.subscriptionChatMessages.unsubscribe();
    }

    if (disableAgentInput) {
      this.fetchingEpisodeChat = true;
    }

    this.subscriptionChatMessages = this.conversationService.getChat(this.selectedEpisode._id)
      .subscribe(
        chatMessages => {
          if (chatMessages) {
            this.chatMessageList = chatMessages;
          }

          if (this.pollEpisodeChat) {
            setTimeout(() => {
              this.getChatMessages();
            }, this.chatPollingFrequency);
          }

          this.scrollToView('chatWindowBottomDiv');
          this.fetchingEpisodeChat = false;
        },
        error => {
          // Do something with it
          
          if (this.pollEpisodeChat) {
            setTimeout(() => {
              this.getChatMessages();
            }, this.chatPollingFrequency);
          }

          this.fetchingEpisodeChat = false;
        }
      );
  }

  getSafeHTML(inlineHtml: string) {
    if (inlineHtml) {
      return this.sanitizer.bypassSecurityTrustHtml(inlineHtml);
    }
    return '';
  }

  requestFocus(divId: string) {
    if (divId) {
      setTimeout(() => {
        const htmlElement = document.getElementById(divId);
        if (htmlElement) {
          htmlElement.focus();
        }
      }, 10);
    }
  }

  scrollToView(elementId: string) {
    setTimeout(() => {
      this.scrollService.triggerScrollTo(elementId);
    }, 10);
  }

  hasUserAlreadyBargedIn() {
    let bargedIn = false;

    for (let episode of this.episodeList) {
      if (episode && episode._id && episode.bargedIn) {
        bargedIn = true;
        break;
      }
    }
    return bargedIn;
  }

  bargedIntoSelectedEpisode() {
    return this.hasUserAlreadyBargedIn() && this.selectedEpisode && this.selectedEpisode.bargedInAgentId && this.selectedEpisode.bargedInAgentId === this.universalUser.getUser()._id;
  }

  bargeIn() {
    if (this.selectedEpisode && this.selectedEpisode._id) {
      const tempEpisode = JSON.parse(JSON.stringify(this.selectedEpisode));

      for (let episode of this.episodeList) {
        if (episode && episode._id && this.selectedEpisode._id === episode._id) {
          episode.bargedIn = true;
          episode.bargedInAgentId = this.universalUser.getUser()._id;
          tempEpisode.bargedIn = true;
          tempEpisode.bargedInAgentId = this.universalUser.getUser()._id;
          break;
        }
      }

      this.saveEpisode(tempEpisode);
    }
  }

  bargeOut() {
    if (this.selectedEpisode && this.selectedEpisode._id) {
      const tempEpisode = JSON.parse(JSON.stringify(this.selectedEpisode));

      for (let episode of this.episodeList) {
        if (episode && episode._id && this.selectedEpisode._id === episode._id) {
          episode.bargedIn = false;
          episode.bargedInAgentId = null;
          tempEpisode.bargedIn = false;
          tempEpisode.bargedInAgentId = null;
          break;
        }
      }

      this.saveEpisode(tempEpisode);
    }
  }

  saveEpisode(episode: Episode) {
    this.pollBargeInEpisode = false;
    this.fetchingEpisodeDetails = true;
    this.fetchingEpisodeChat = true;

    this.subscriptionSaveEpisode = this.conversationService.saveEpisode(episode)
      .subscribe(
        episode => {
          if (episode && episode._id) {
            this.selectedEpisode = episode;
          }

          if (this.bargedIntoSelectedEpisode()) {
            this.pollEpisodeChat = true;
            this.getChatMessages();
          } else {
            this.pollEpisodeChat = false;
          }
          this.pollBargeInEpisode = true;
          this.fetchingEpisodeDetails = false;
          this.fetchingEpisodeChat = false;
          this.getEpisodesApplicableForBargeIn();
        },
        error => {
          // Do something with it
          this.pollBargeInEpisode = true;
          this.fetchingEpisodeDetails = false;
          this.fetchingEpisodeChat = false;
          this.getEpisodesApplicableForBargeIn();
        }
      );
  }

  sendAgentMessage() {
    if (this.bargedIntoSelectedEpisode()) {
      const messagePayload = {
        "agentId": this.selectedEpisode.agentId,
        "episodeId": this.selectedEpisode._id,
        "messageText": this.agentMessage,
        "conversationId": this.selectedEpisode.conversationId,
        "from_user": this.universalUser.getUser()._id
      };
      
      const newMessage = new ChatMessage();
      newMessage.agentId = this.selectedEpisode.agentId;
      newMessage.episodeId = this.selectedEpisode._id;
      newMessage.messageText = messagePayload.messageText;
      newMessage.conversationId = this.selectedEpisode.conversationId;
      newMessage.from = "AUTO";
      newMessage.messageTime = new Date();

      this.chatMessageList.push(newMessage);
      this.scrollToView('chatWindowBottomDiv');

      this.subscriptionSendAgentMessage = this.conversationService.sendAgentMessage(messagePayload)
        .subscribe(
          response => {
            // Do something with it, if needed
          },
          error => {
            // Do something with it
          }
        );
    }
    this.agentMessage = '';
    this.requestFocus('agentInput');
  }
}