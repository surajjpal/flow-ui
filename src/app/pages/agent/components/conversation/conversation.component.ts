import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ConversationService } from '../../../../services/agent.service';
import { Episode, ChatMessage } from '../../../../models/conversation.model';

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

  private subscription: Subscription;
  
  constructor(
    private conversationService: ConversationService
  ) {
    this.searchQuery = '';
    this.loading = false;
    this.episodeList = [];
    this.selectedEpisode = new Episode();
    this.chatMessageList = [];
  }
  
  ngOnInit() {
    
  }
  
  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
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
}
