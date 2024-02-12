# Tutorial Overview

The diagram shows the order and dependency of the different modules of this tutorial. Most modules are based on each other and you need to work through them in the given sequence. Some are additional steps that aren’t picked up by others. Optional modules are marked in gray.

!!! info "Click on the boxes to go directly to the first step of the module."

```mermaid
graph TD
1[Create a CAP Service and SAP Fiori UI] --> 2[Deploy Your CAP Service<br/> on SAP BTP, Cloud Foundry Environment]
click 1 "../Create-CAP-Application"
1[Create a CAP Service and SAP Fiori UI] --> 3[Run Your CAP Application <br/> on SAP BTP, Kyma Runtime]
click 3 "../Kyma-Prepare-BTP"
1[Create a CAP Service and SAP Fiori UI] --> 7[Create an SAP Fiori Elements-Based Analytical UI]
7[Create an SAP Fiori Elements-Based Analytical UI]
click 7 "../Analytics-Setup-Use"
2[Deploy Your CAP Service<br/> on SAP BTP, Cloud Foundry Environment] --> 4[Create a CI/CD Pipeline]
click 2 "../Prepare-BTP"
4[Create a CI/CD Pipeline] --> 5[Consume Remote Services]
click 4 "../CI-CD-BTP"
5[Consume Remote Services]--> 6[Consume Events]
click 5 "../Ext-Service-Add-Consumption"
6[Consume Events]
click 6 "../Events-App-Setup-S4HC"

%% -- Formatting --
class 1,2,3,4,5,6,7,8,9,10 SAPcolors;
class 4,7 SAPcolorsOptional;
classDef SAPcolors fill:#008FD3,stroke:#008FD3, color:#fff, stroke-width:4px;
classDef SAPcolorsOptional fill:#CCC,stroke:#000, color:#000, stroke-width:2px, stroke-dasharray: 5 5;
```
