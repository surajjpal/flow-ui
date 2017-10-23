declare var showModal: any;

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Agent, Domain, Goal, Plugin, Classifier } from '../../agent.model';
import { GraphObject } from '../../../flow/flow.model';
import { AgentService } from '../../agent.services';
import { GraphService } from '../../../flow/flow.service';
import { DataSharingService } from '../../../../shared/shared.service';

@Component({
  selector: 'api-agent-agent',
  templateUrl: './agentCreation.component.html',
  styleUrls: ['./agent.scss']
})
export class AgentCreationComponent implements OnInit {

  agentCreateMode: boolean;
  modalHeader: string;
  createMode: boolean;

  selectedAgent: Agent;
  selectedDomain: Domain;
  domainSource: Domain[];
  selectedDomainList: Domain[];
  flowSource: GraphObject[];

  isWatsonEnabled: boolean;
  isApiEnabled: boolean;
  watsonClassifier: Classifier;
  apiClassifier: Classifier;

  facebookPlugin: Plugin;

  @ViewChild('successModal') successModal: ElementRef;
  facebookIntegrated: boolean;
  webhook: string;
  isSuccess: boolean;
  errorMessage: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private agentService: AgentService,
    private graphService: GraphService,
    private sharingService: DataSharingService
  ) {
    this.modalHeader = '';
    this.createMode = true;
    this.selectedAgent = new Agent();
    this.domainSource = [];
    this.selectedDomainList = [];
    this.flowSource = [];

    this.isWatsonEnabled = false;
    this.watsonClassifier = new Classifier();
    this.watsonClassifier.classifierServiceName = 'WATSON';
    this.watsonClassifier.classifierServiceUrl = null;
    this.watsonClassifier.classifierServiceToken = null;

    this.isApiEnabled = false;
    this.apiClassifier = new Classifier();
    this.apiClassifier.classifierServiceName = 'API';
    this.apiClassifier.classifierWorkspaceId = null;
    this.apiClassifier.classifierUsername = null;
    this.apiClassifier.classifierPassword = null;
    this.apiClassifier.classifierVersion = null;

    this.facebookPlugin = new Plugin();
    this.facebookPlugin.messengerName = 'FBMESSENGER';

    this.facebookIntegrated = false;
    this.webhook = '';
    this.isSuccess = true;
    this.errorMessage = '';
  }

  ngOnInit() {
    this.fetchLookups();

    const agent: Agent = this.sharingService.getSharedObject();
    if (agent) {
      this.selectedAgent = agent;
      this.agentCreateMode = false;

      if (this.selectedAgent.agentPlugins && this.selectedAgent.agentPlugins.length > 0) {
        const pluginsToBeRemoved: Plugin[] = [];
        for (const plugin of this.selectedAgent.agentPlugins) {
          if (plugin && plugin.messengerName === 'FBMESSENGER') {
            this.facebookPlugin = JSON.parse(JSON.stringify(this.selectedAgent.agentPlugins[0]));
            pluginsToBeRemoved.push(plugin);
          }
        }

        for (const plugin of pluginsToBeRemoved) {
          const index: number = this.selectedAgent.agentPlugins.indexOf(plugin);
          if (index !== -1) {
            this.selectedAgent.agentPlugins.splice(index, 1);
          }
        }
      }

      if (this.selectedAgent.agentClassifier && this.selectedAgent.agentClassifier.length > 0) {
        const classifiersToBeRemoved: Classifier[] = [];
        for (const classifier of this.selectedAgent.agentClassifier) {
          if (classifier && classifier.classifierServiceName && classifier.classifierServiceName.length > 0) {
            if (classifier.classifierServiceName === 'WATSON') {
              this.watsonClassifier = JSON.parse(JSON.stringify(classifier));
              this.isWatsonEnabled = true;
              classifiersToBeRemoved.push(classifier);
            } else if (classifier.classifierServiceName === 'API') {
              this.apiClassifier = JSON.parse(JSON.stringify(classifier));
              this.isApiEnabled = true;
              classifiersToBeRemoved.push(classifier);
            }
          }
        }

        for (const classifier of classifiersToBeRemoved) {
          const index: number = this.selectedAgent.agentClassifier.indexOf(classifier);
          if (index !== -1) {
            this.selectedAgent.agentClassifier.splice(index, 1);
          }
        }
      }
    } else {
      this.selectedAgent = new Agent();
      this.agentCreateMode = true;
    }
  }

  fetchLookups() {
    this.agentService.domainLookup()
      .then(
      domainList => {
        if (domainList) {
          this.domainSource = domainList;

          if (!this.agentCreateMode) {
            if (this.selectedAgent.domainNameList && this.selectedAgent.domainNameList.length > 0) {
              for (const domainName of this.selectedAgent.domainNameList) {
                for (const domain of this.domainSource) {
                  if (domainName === domain.name) {
                    this.addDomain(domain);
                    break;
                  }
                }
              }
            }
          }
        }
      }
      );

    this.graphService.fetch()
      .then(
      flowSource => {
        if (flowSource) {
          this.flowSource = flowSource;
        }
      }
      );
  }

  resetAgentFields() {
    this.selectedAgent = new Agent();
  }

  createAgent() {
    if (this.selectedAgent) {
      if (this.selectedDomainList) {
        for (const domain of this.selectedDomainList) {
          this.selectedAgent.domainNameList.push(domain.name);
        }
      }

      if (this.selectedAgent.langSupported || this.selectedAgent.langSupported.length <= 0) {
        this.selectedAgent.langSupported = ['ENG', 'HIN'];
      }

      if (this.selectedAgent.companyKey || this.selectedAgent.companyKey.length <= 0) {
        this.selectedAgent.companyKey = 'bank123';
      }

      if (this.isApiEnabled && this.apiClassifierValidator()) {
        this.selectedAgent.agentClassifier.push(this.apiClassifier);
      }

      if (this.isWatsonEnabled && this.watsonClassifierValidator()) {
        this.selectedAgent.agentClassifier.push(this.watsonClassifier);
      }

      if (this.facebookPluginValidator()) {
        this.selectedAgent.agentPlugins.push(this.facebookPlugin);
      }

      this.agentService.saveAgent(this.selectedAgent)
        .then(
        response => {
          if (response) {
            if (response.status >= 200 && response.status < 300) {
              this.isSuccess = true;

              if (response._body) {
                const agentString: string = response._body;

                if (agentString && agentString.length > 0) {
                  const createdAgent: Agent = JSON.parse(agentString);

                  if (createdAgent) {
                    if (createdAgent.agentPlugins && createdAgent.agentPlugins.length > 0) {
                      const facebookPlugin: Plugin = createdAgent.agentPlugins[0];

                      if (facebookPlugin && facebookPlugin.webhook && facebookPlugin.webhook.length > 0) {
                        this.facebookIntegrated = true;
                        this.webhook = facebookPlugin.webhook;
                        new showModal('successModal');
                        return;
                      }
                    }

                    this.facebookIntegrated = false;
                    this.webhook = '';
                    new showModal('successModal');
                  }
                }
              }
            } else {
              this.isSuccess = false;

              if (response._body) {
                this.errorMessage = response._body;
              }
            }
          }
        }
        );
    }
  }

  onDomainSelect(domain: Domain) {
    if (domain) {
      this.selectedDomain = domain;
    }
  }

  arrayToString(array: string[]) {
    let arrayString: string = 'none';

    for (let i = 0, len = array.length; i < len; i++) {
      if (i === 0) {
        arrayString = '';
      }

      arrayString += array[i];

      if (i < (len - 1)) {
        arrayString += ', ';
      }
    }

    return arrayString;
  }

  domainGoalsToString(goals: Goal[]) {
    let goalString: string = 'none';

    if (goals) {
      for (let i = 0, len = goals.length; i < len; i++) {
        if (i === 0) {
          goalString = '';
        }

        if (goals[i] && goals[i].goalName && goals[i].goalName.length > 0) {
          goalString += goals[i].goalName;
        }

        if (i < (len - 1)) {
          goalString += ', ';
        }
      }
    }

    return goalString;
  }

  containsAll() {
    let containsAll: boolean = true;

    for (const domain of this.domainSource) {
      containsAll = containsAll && this.domainAddedToList(domain);
    }

    return containsAll;
  }

  domainAddedToList(domain?: Domain) {
    if (domain) {
      return this.selectedDomainList && this.selectedDomainList.length > 0
        && domain && this.selectedDomainList.includes(domain);
    } else {
      return this.selectedDomainList && this.selectedDomainList.length > 0
        && this.selectedDomain && this.selectedDomainList.includes(this.selectedDomain);
    }
  }

  addDomain(domain?: Domain) {
    if (domain) {
      if (!this.domainAddedToList(domain)) {
        this.selectedDomainList.push(domain);
      }
    } else {
      if (!this.domainAddedToList()) {
        this.selectedDomainList.push(this.selectedDomain);
      }
    }
  }

  removeDomain() {
    if (this.domainAddedToList()) {
      const index: number = this.selectedDomainList.indexOf(this.selectedDomain);
      if (index !== -1) {
        this.selectedDomainList.splice(index, 1);
      }
    }
  }

  addAllDomain() {
    if (this.selectedDomainList && this.domainSource) {
      for (const domain of this.domainSource) {
        if (!this.domainAddedToList(domain)) {
          this.selectedDomainList.push(domain);
        }
      }
    }
  }

  removeAllDomain() {
    if (this.selectedDomainList && this.domainSource) {
      for (const domain of this.domainSource) {
        if (this.domainAddedToList(domain)) {
          const index: number = this.selectedDomainList.indexOf(domain);
          if (index !== -1) {
            this.selectedDomainList.splice(index, 1);
          }
        }
      }
    }
  }

  apiClassifierValidator() {
    return this.apiClassifier && this.apiClassifier.classifierServiceUrl && this.apiClassifier.classifierServiceToken
      && this.apiClassifier.classifierServiceUrl.length > 0 && this.apiClassifier.classifierServiceToken.length > 0;
  }

  watsonClassifierValidator() {
    return this.watsonClassifier && this.watsonClassifier.classifierWorkspaceId
      && this.watsonClassifier.classifierUsername && this.watsonClassifier.classifierPassword
      && this.watsonClassifier.classifierVersion && this.watsonClassifier.classifierWorkspaceId.length > 0
      && this.watsonClassifier.classifierUsername.length > 0 && this.watsonClassifier.classifierPassword.length > 0
      && this.watsonClassifier.classifierVersion.length > 0;
  }

  facebookPluginValidator() {
    return this.facebookPlugin && this.facebookPlugin.apitoken && this.facebookPlugin.validation
      && this.facebookPlugin.serviceDownMsg && this.facebookPlugin.apitoken.length > 0
      && this.facebookPlugin.validation.length > 0 && this.facebookPlugin.serviceDownMsg.length > 0;
  }

  goToAgentsListing() {
    if (this.isSuccess) {
      this.router.navigate(['/pages/agent/agents'], { relativeTo: this.route });
    }
  }
}
