import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Agent, Plugin, Classifier } from '../../../../models/agent.model';
import { Domain } from '../../../../models/domain.model';
import { AgentService } from '../../../../services/agent.service';
import { DataSharingService } from '../../../../services/shared.service';

@Component ({
  selector: 'api-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.scss']
})
export class AgentsComponent implements OnInit, OnDestroy {
  filterQuery: string;
  agentSource: Agent[];
  selectedAgent: Agent;
  agentPageNo: number;
  agentPageSize: number;
  moreAgentPages: boolean;
  fields: String[];

  private subscription: Subscription;
  private agentSubscription: Subscription;
  
  constructor(
    private agentService: AgentService,
    private router: Router,
    private route: ActivatedRoute,
    private sharingService: DataSharingService
  ) {
    this.agentSource = [];
    this.selectedAgent = new Agent();
  }
  
  ngOnInit() {
    this.agentPageNo = 0;
    this.agentPageSize = 5;
    this.fields = [];
    this.fields.push("_id");
    this.fields.push("name");
    this.fields.push("agentFlow");
    this.fields.push("langSupported");
    this.fields.push("agentDomain");
    this.fields.push("agentPlugins");
    this.fields.push("agentClassifier");
    this.fetchAgents();
  }
  
  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if(this.agentSubscription && !this.agentSubscription.closed) {
      this.agentSubscription.unsubscribe();
    }
  }

  
  fetchAgents() {
    this.subscription = this.agentService.agentLookupByPage(this.agentPageNo, this.agentPageSize, this.fields)
      .subscribe(
        agents => {
          if (agents) {
            if(agents.length < this.agentPageSize) {
              this.moreAgentPages = false;
            } else {
              this.moreAgentPages = true;
              this.agentPageNo += 1;
            }
            this.agentSource = this.agentSource.concat(agents);
          }
        }
      );
  }

  onAgentSelect(agent?: Agent) {
    if (agent) {
      this.selectedAgent = agent;
      this.agentSubscription = this.agentService.getAgentById(agent._id).subscribe(receivedAgent=> {
        if(receivedAgent) {
          this.sharingService.setSharedObject(receivedAgent);
          this.router.navigate(['/pg/agnt/ags'], { relativeTo: this.route });
        }
      });
    } else {
      this.router.navigate(['/pg/agnt/ags'], { relativeTo: this.route });
      this.selectedAgent = null;
    }    
  }

  arrayToString(array: String[]) {
    let arrayString: string = 'none';

    if (array) {
      for (let i = 0, len = array.length; i < len; i++) {
        if (i === 0) {
          arrayString = '';
        }

        if (array[i] && array[i].length > 0) {
          arrayString += array[i];
        }

        if (i < (len - 1)) {
          arrayString += ', ';
        }
      }
    }

    return arrayString;
  }

  domainsToString(domains: Domain[]) {
    let domainString: string = 'none';
  
    if (domains) {
      for (let i = 0, len = domains.length; i < len; i++) {
        if (i === 0) {
          domainString = '';
        }

        if (domains[i] && domains[i].name && domains[i].name.length > 0) {
          domainString += domains[i].name;
        }

        if (i < (len - 1)) {
          domainString += ', ';
        }
      }
    }

    return domainString;
  }

  pluginsToString(plugins: Plugin[]) {
    let pluginString: string = 'none';
  
    if (plugins) {
      for (let i = 0, len = plugins.length; i < len; i++) {
        if (i === 0) {
          pluginString = '';
        }

        if (plugins[i] && plugins[i].messengerName && plugins[i].messengerName.length > 0) {
          pluginString += plugins[i].messengerName;
        }

        if (i < (len - 1)) {
          pluginString += ', ';
        }
      }
    }

    return pluginString;
  }

  classifiersToString(classifiers: Classifier[]) {
    let classifierString: string = 'none';
  
    if (classifiers) {
      for (let i = 0, len = classifiers.length; i < len; i++) {
        if (i === 0) {
          classifierString = '';
        }

        if (classifiers[i] && classifiers[i].classifierServiceName && classifiers[i].classifierServiceName.length > 0) {
          classifierString += classifiers[i].classifierServiceName;
        }

        if (i < (len - 1)) {
          classifierString += ', ';
        }
      }
    }

    return classifierString;
  }
}
