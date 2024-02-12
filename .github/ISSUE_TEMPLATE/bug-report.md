---
name: Bug Report
about: Create a report to help us improve
title: Please enter a short and crisp title
labels: ''
assignees: ''

---

### Description of erroneous behaviour

> Please test with the **latest release version** of the CAP runtime (see links below).
Replace this text with a **clear** and **concise** description of the issue, including examples and links to your content as well as log output.

### Detailed steps to reproduce

> For example (→ replace by appropriate ones for your case):
> 1. git clone https://github.wdf.sap.corp/your/repo
> 2. npm install
> 3. cds deploy srv -2 sqlite

### Details about your project

> Remove the lines not applicable, and fill in versions for remaining ones:

| Your Project Name | https://github.wdf.sap.corp/your/repo |
|:------------------|---------------------------------------|
| CAP Java SDK      | [cds-services](https://github.wdf.sap.corp/cds-java/cds-services/releases) 1.x.x |
| CAP Java Classic  | Gateway [servicesdk](http://nexus.wdf.sap.corp:8081/nexus/content/repositories/deploy.releases/com/sap/cloud/servicesdk/prov/parent/) 1.x.x (consider [migrating](https://github.wdf.sap.corp/pages/cap/java/migration)) |
| OData version     | v4 / v2                               |
| Node.js version   | v12.x.x                               |
| @sap/cds          | 4.x.x                                 |
| @sap/cds-runtime  | 2.x.x                                 |
| @sap/cds-compiler | 1.x.x                                 |
| @sap/cds-dk       | 2.x.x                                 |

> Run `cds v -i` in your project root to generate this with `@sap/cds-dk@^1.8.1`
