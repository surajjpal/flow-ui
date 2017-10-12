import { Component, OnInit } from '@angular/core';

import { Agent, Domain, Goal, Plugin, Classifier } from '../../agent.model';
import { GraphObject } from '../../../flow/flow.model';
import { AgentService } from '../../agent.services';
import { GraphService } from '../../../flow/flow.service';

@Component({
  selector: 'api-agent-agent',
  templateUrl: './agentCreation.component.html',
  styleUrls: ['./agent.scss']
})
export class AgentCreationComponent implements OnInit {

  modalHeader: string;
  createMode: boolean;

  selectedAgent: Agent;
  selectedPlugin: Plugin;
  tempPlugin: Plugin;
  selectedClassifier: Classifier;
  tempClassifier: Classifier;
  selectedDomain: Domain;
  domainSource: Domain[];
  selectedDomainList: Domain[];
  flowSource: GraphObject[];

  constructor(
      private agentService: AgentService,
      private graphService: GraphService
    ) {
    this.modalHeader = '';
    this.createMode = true;
    this.selectedAgent = new Agent();
    this.selectedPlugin = new Plugin();
    this.tempPlugin = new Plugin();
    this.selectedClassifier = new Classifier();
    this.tempClassifier = new Classifier();
    this.domainSource = [];
    this.selectedDomainList = [];
    this.flowSource = [];
  }

  ngOnInit() {
    this.fetchLookups();
  }

  fetchLookups() {
    this.agentService.domainLookup()
    .then(
      domainList => {
        if (domainList) {
          this.domainSource = domainList;
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

      this.agentService.saveAgent(this.selectedAgent)
        .then(
          response => {
            console.log(response);
            this.ngOnInit();
          }
        );
    }
  }

  onDomainSelect(domain: Domain) {
    if (domain) {
      this.selectedDomain = domain;
    }
  }

  onPluginSelect(plugin?: Plugin) {
    if (plugin) {
      this.modalHeader = 'Update Plugin';
      this.createMode = false;
      this.selectedPlugin = plugin;
      this.tempPlugin = JSON.parse(JSON.stringify(this.selectedPlugin));
    } else {
      this.modalHeader = 'Create Plugin';
      this.createMode = true;
      this.selectedPlugin = null;
      this.tempPlugin = new Plugin();
    }
  }

  addPlugin() {
    if (this.selectedPlugin) {
      const index: number = this.selectedAgent.agentPlugins.indexOf(this.selectedPlugin);
      if (index !== -1) {
        this.selectedAgent.agentPlugins[index] = this.tempPlugin;
      }
    } else {
      this.selectedAgent.agentPlugins.push(this.tempPlugin);
    }
  }

  removePlugin() {
    if (this.selectedPlugin) {
      const index: number = this.selectedAgent.agentPlugins.indexOf(this.selectedPlugin);
      if (index !== -1) {
        this.selectedAgent.agentPlugins.splice(index, 1);
      }
    }
  }

  onClassifierSelect(classifier?: Classifier) {
    if (classifier) {
      this.modalHeader = 'Update Classifier';
      this.createMode = false;
      this.selectedClassifier = classifier;
      this.tempClassifier = JSON.parse(JSON.stringify(this.selectedClassifier));
    } else {
      this.modalHeader = 'Create Classifier';
      this.createMode = true;
      this.selectedClassifier = null;
      this.tempClassifier = new Classifier();
    }
  }

  addClassifier() {
    if (this.selectedClassifier) {
      const index: number = this.selectedAgent.agentClassifier.indexOf(this.selectedClassifier);
      if (index !== -1) {
        this.selectedAgent.agentClassifier[index] = this.tempClassifier;
      }
    } else {
      this.selectedAgent.agentClassifier.push(this.tempClassifier);
    }
  }

  removeClassifier() {
    if (this.selectedClassifier) {
      const index: number = this.selectedAgent.agentClassifier.indexOf(this.selectedClassifier);
      if (index !== -1) {
        this.selectedAgent.agentClassifier.splice(index, 1);
      }
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

  addDomain() {
    if (!this.domainAddedToList()) {
      this.selectedDomainList.push(this.selectedDomain);
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
}
