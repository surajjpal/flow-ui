import { Component, OnInit } from '@angular/core';

import { ConversationService } from '../../auto.service';
import { Episode, ChatMessage } from '../../auto.model';

declare let moment: any;

@Component({
  selector: 'api-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.scss']
})
export class ConversationComponent implements OnInit {

  filterQuery: string;
  searchQuery: string;
  episodeList: Episode[];
  selectedEpisode: Episode;
  chatMessageList: ChatMessage[];
  loading;

  constructor(
    private conversationService: ConversationService
  ) {
    this.filterQuery = '';
    this.searchQuery = '';
    this.loading = false;
    this.episodeList = [];
    this.selectedEpisode = new Episode();
    this.chatMessageList = [];
  }

  ngOnInit() {
    this.onTextChange(this.searchQuery);
  }

  onTextChange(searchQuery: string) {
    if (!searchQuery && searchQuery.length <= 0) {
      return;
    }
    
    this.searchQuery = searchQuery;
    this.loading = true;

    this.conversationService.search(searchQuery)
      .then(
        episodeList => {
          this.loading = false;
          if (episodeList) {
            this.episodeList = episodeList;

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

  onSelect(selectedEpisode: Episode): void {
    this.selectedEpisode = selectedEpisode;
    this.chatMessageList = [];

    this.conversationService.getChat(selectedEpisode._id)
      .then(
        chatMessageList => {
          if (chatMessageList) {
            chatMessageList.reverse();    // To get latest message at bottom of screen
            this.chatMessageList = chatMessageList;
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
