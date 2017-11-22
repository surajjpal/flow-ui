import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Agent, Plugin, Classifier } from '../../../../models/agent.model';
import { Domain } from '../../../../models/domain.model';
import { AgentService } from '../../agent.services';
import { DataSharingService } from '../../../../shared/shared.service';

@Component ({
  selector: 'api-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.scss']
})
export class AgentsComponent implements OnInit {

  filterQuery: string;
  agentSource: Agent[];
  selectedAgent: Agent;

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
    this.fetchAgents();
  }

  fetchAgents() {
    this.agentService.agentLookup()
      .then(
        agents => {
          if (agents) {
            this.agentSource = agents;
          }
        }
      );
  }

  onAgentSelect(agent?: Agent) {
    if (agent) {
      this.selectedAgent = agent;
    } else {
      this.selectedAgent = null;
    }

    this.sharingService.setSharedObject(this.selectedAgent);

    this.router.navigate(['/pages/agent/agentCreation'], { relativeTo: this.route });
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
