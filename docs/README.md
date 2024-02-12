# ⛔️ DEPRECATED

The tutorials described in our GitHub repositories and our GitHub Pages is no longer maintained, to see an overview of our maintained tutorials on the tutorial navigator read this [blog.](https://blogs.sap.com/2022/06/28/an-overview-of-learning-cap-development-through-tutorials/)

# Welcome

Welcome to this tutorial for application development on SAP Business Technology Platform (SAP BTP). We provide information and examples on how to develop and deploy an application based on [SAP Cloud Application Programming Model (CAP)](https://cap.cloud.sap/) on SAP BTP using different tools and services step by step.

## Who Is This Tutorial For?

The tutorial is suitable for new or experienced developers on SAP BTP. The purpose of this project is to help application developers get a quick start on development, provide best practices, solve common issues, use common services, identify areas that need to be improved, and have an end-to-end scenario for validation.


## What Topics Are Covered in the Tutorial?

The tutorial covers a variety of topics starting from basic onboarding tasks to creating development pipelines. The tasks are bundled in step-by-step tutorial modules that feature the following topics:

- Setting up the development environment
- Creating a service based on CAP
- Implementing authorization checks
- Creating a SAP BTP trial account
- Deployment on SAP BTP, Cloud Foundry environment
- Deployment on SAP BTP Kyma runtime
- Extending your application with different SAP services


**Disclaimer: This tutorial already contains many modules, but is still under development and we keep improving it.**


## Execution Sequence
The tutorial is divided into several atomic (that is, have to be executed from start to finish without interruptions) groups of tutorial modules. The groups define the order of execution of the tutorial modules. The groups are also organized in missions when published on the [Tutorial Navigator](https://developers.sap.com/tutorial-navigator.html). The missions are:

- [Build an Application End-to-End Using CAP, Node.js and VS Code](https://developers.sap.com/mission.btp-application-cap-e2e.html)
- [Deploy Your CAP Application on SAP BTP Kyma Runtime](https://developers.sap.com/mission.btp-deploy-cap-kyma.html)
- [Consume Remote Services from SAP S/4HANA Cloud Using CAP](https://developers.sap.com/mission.btp-consume-external-service-cap.html)
- [Consume Remote Services from SAP S/4HANA Using CAP](https://developers.sap.com/mission.btp-consume-external-service-s4hana-cap.html)
- [Consume Events from SAP S/4HANA Cloud Using CAP](https://developers.sap.com/mission.btp-consume-events-s4hana-cloud-cap.html)

The tutorial also includes two standalone modules:

- [Configure and Run a Predefined SAP Continuous Integration and Delivery (CI/CD) Pipeline](https://developers.sap.com/tutorials/btp-app-ci-cd-btp.html)
- [Create an SAP Fiori Elements-Based Analytical UI for your CAP Application](https://developers.sap.com/tutorials/btp-app-analytics-setup-use.html)

### Testing and Validation

Newly updated tutorial modules are first published to the [Tutorial Navigator QA instance](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/) for testing. Since the QA instance doesn't organize the tutorial modules into groups and missions, the table below shows an ordered list of all tutorial modules that are part of this tutorial. Most modules are based on each other and you need to work through them in the given sequence. The **Prerequisites** section of each module lists all you need to do before starting with it. 

| Step | Tutorial | Links |
| ----- | ----- | ----- | 
| 1 | Prepare Your Development Environment for CAP | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-prepare-dev-environment-cap.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-prepare-dev-environment-cap.html) | 
| 2 | Create a CAP-Based Application | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-create-cap-application.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-create-cap-application.html) | 
| 3 | Create an SAP Fiori Elements-Based UI | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-create-ui-fiori-elements.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-create-ui-fiori-elements.html) | 
| 4 | Add Business Logic to Your Application | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-cap-business-logic.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-cap-business-logic.html) | 
| 5 | Create a UI Using Freestyle SAPUI5 | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-create-ui-freestyle-sapui5.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-create-ui-freestyle-sapui5.html) | 
| 6 | Use a Local Launch Page | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-launchpage.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-launchpage.html) | 
| 7 | Implement Roles and Authorization Checks In CAP | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-cap-roles.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-cap-roles.html) | 
| 8 | Prepare for SAP BTP Development | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-prepare-btp.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-prepare-btp.html) | 
| 9 | Add SAP HANA Support to Your Project | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-hana-app-setup.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-hana-app-setup.html) | 
| 10 | Set Up the SAP HANA Cloud Service | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-hana-cloud-setup.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-hana-cloud-setup.html) | 
| 11 | Prepare User Authentication and Authorization (XSUAA) Setup | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-prepare-xsuaa.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-prepare-xsuaa.html) | 
| 12 | Deploy Your Multi-Target Application (MTA) | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-cap-mta-deployment.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-cap-mta-deployment.html) | 
| 13 | Prepare SAP Build Work Zone, Standard Edition Setup | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-work-zone-setup.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-work-zone-setup.html) | 
| 14 | Subscribe to the SAP Build Work Zone, Standard Edition | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-work-zone-subscribe.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-work-zone-subscribe.html) | 
| 15 | Assign a Role Collection to a User | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-role-assignment.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-role-assignment.html) | 
| 16 | Enable Logging Service for Your Application | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-logging.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-logging.html) | 
| 17 | Undeploy Your Multi-Target Application (MTA) | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-undeploy-cap-application.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-undeploy-cap-application.html) | 
| 18 | Prepare for SAP BTP Development with Kyma | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-kyma-prepare-btp.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-kyma-prepare-btp.html) | 
| 19 | Prepare Your Kyma Development Environment | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-kyma-prepare-dev-environment.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-kyma-prepare-dev-environment.html) | 
| 20 | Set Up SAP HANA Cloud for Kyma | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-kyma-hana-cloud-setup.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-kyma-hana-cloud-setup.html) | 
| 21 | Prepare User Authentication and Authorization (XSUAA) Setup | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-prepare-xsuaa.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-prepare-xsuaa.html) | 
| 22 | Add Helm Chart | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-kyma-add-helm-chart.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-kyma-add-helm-chart.html) | 
| 23 | Deploy Your CAP Application to Kyma | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-kyma-deploy-application.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-kyma-deploy-application.html) | 
| 24 | Prepare SAP Build Work Zone, Standard Edition Setup for Kyma | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-kyma-work-zone-setup.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-kyma-work-zone-setup.html) | 
| 25 | Create a SAP Build Work Zone, Standard Edition Site for Your Kyma CAP App | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-kyma-work-zone-subscribe.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-kyma-work-zone-subscribe.html) | 
| 26 | Assign a Role Collection to a User | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-kyma-role-assignment.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-kyma-role-assignment.html) | 
| 27 | Undeploy Your CAP Application from Kyma | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-kyma-undeploy-cap-application.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-kyma-undeploy-cap-application.html) | 
| 28 | Configure and Run a Predefined SAP Continuous Integration and Delivery (CI/CD) Pipeline | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-ci-cd-btp.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-ci-cd-btp.html) | 
| 29 | Create an SAP Fiori Elements-Based Analytical UI for your CAP Application | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-analytics-setup-use.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-analytics-setup-use.html) | 
| 30 | Add the Consumption of an External Service to Your CAP Application | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-ext-service-add-consumption.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-ext-service-add-consumption.html) | 
| 31 | Consume the External Service in the UI of Your Application | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-ext-service-consume-ui.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-ext-service-consume-ui.html) | 
| 32 | Register Your SAP S/4HANA Cloud System | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-ext-service-s4hc-register.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-ext-service-s4hc-register.html) | 
| 33 | Use Your SAP S/4HANA Cloud Service for Your Deployed CAP Application | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-ext-service-s4hc-use.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-ext-service-s4hc-use.html) | 
| 34 | Prepare SAP S/4HANA System by Activating the Business Partner OData Service | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-ext-service-odata-service.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-ext-service-odata-service.html) | 
| 35 | Configure Systems in Cloud Connector | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-ext-service-cloud-connector.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-ext-service-cloud-connector.html) | 
| 36 | Add Services and Consume an External Service from SAP S/4HANA | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-ext-service-s4hana-consume.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-ext-service-s4hana-consume.html) | 
| 37 | Set Up Your CAP Application for Eventing | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-events-app-setup-s4hc.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-events-app-setup-s4hc.html) | 
| 38 | Enable Events from SAP S/4HANA Cloud to SAP BTP | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-events-enable-s4hc.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-events-enable-s4hc.html) | 
| 39 | Use Events from SAP S/4HANA Cloud to Update Your Deployed CAP Application | [QA](https://developers-qa-blue.wcms-nonprod.c.eu-de-2.cloud.sap/tutorials/btp-app-events-s4hc-use.html) \| [PROD](https://developers.sap.com/tutorials/btp-app-events-s4hc-use.html) | 



## Support

If you have issues during the tutorial, please refer to the [official documentation of CAP](https://cap.cloud.sap/docs/about/) as well as the [official documentation for SAP BTP](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/08d1103928fb42f3a73b3f425e00e13c.html).

If you find an issue in the tutorial or you struggle, please open an issue [here](https://github.tools.sap/CPES/CPAppDevelopment-dev/issues).


## We Need Your Help to Make It Better!

If you have an idea about a new topic or you want to contribute to the tutorial, please send an email to the tutorial core team (see below).

We'd be also happy get your feedback on what you liked or didn't like about this tutorial.

## Tutorial Team

### Core Maintainers

* Pandeliev, Svetoslav <s.pandeliev@sap.com>
* Shankar, Manjunath Kodehalli <m.shankar@sap.com>

### Testing and Validation

* K H, Mamatha <mamatha.k.h@sap.com>

### All contributors

The [Contributors](https://github.tools.sap/CPES/CPAppDevelopment-dev/graphs/contributors) page lists everyone that has contributed to the project over time.




