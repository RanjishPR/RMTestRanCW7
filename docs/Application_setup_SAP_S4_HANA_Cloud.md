# Setup Your Application for Eventing

In this section, you will make the necessary changes to adapt your application for eventing.

1. Add the persistence `BusinessPartners` entity in `db/schema.cds`:

    <!-- cpes-file db/schema.cds -->
```text hl_lines="10 12 22-26 31-32 38"
namespace sap.ui.riskmanagement;
using { managed } from '@sap/cds/common';
  entity Risks : managed {
    key ID      : UUID  @(Core.Computed : true);
    title       : String(100);
    prio        : String(5);
    descr       : String;
    miti        : Association to Mitigations;
    impact      : Integer;
    bp          : Association to BusinessPartners;
    criticality : Integer;
    status      : Association to StatusValues;
  }
  entity Mitigations : managed {
    key ID       : UUID  @(Core.Computed : true);
    description  : String;
    owner        : String;
    timeline     : String;
    risks        : Association to many Risks on risks.miti = $self;
  }

  @cds.autoexpose
  entity StatusValues {
    key value:String;
    criticality: Integer;
  }

  // using an external service from
  using {  API_BUSINESS_PARTNER as external } from '../srv/external/API_BUSINESS_PARTNER.csn';

  @cds.persistence:{table,skip:false}
  @cds.autoexpose
  entity BusinessPartners as projection on external.A_BusinessPartner {
      key BusinessPartner as ID,
      BusinessPartnerFullName as businessPartnerFullName,
      BusinessPartnerIsBlocked as businessPartnerIsBlocked,
      SearchTerm1 as searchTerm1,
      Industry as industry : String(20)
  }
```

2. Open `srv/risk-service.cds` and add the projection for `BusinessPartners` and `BuPaIndustry`:

    ```javascript
    using {  API_BUSINESS_PARTNER as external } from '../srv/external/API_BUSINESS_PARTNER.csn';
    entity BusinessPartners as projection on my.BusinessPartners;
    entity BuPaIndustry as projection on external.A_BuPaIndustry;
    ```

    //TODO: Step 3 below is redundant. Moved to Events-Config-CAP-Deploy-Cloud. Should be removed when rework is completed.

1. Configure the CAP service to listen to the incoming events by adding the following code to `srv/risk-service.js`. The following changes, includes the logic of Persisting BusinessPartners based on the selection in Value Help and then listen for the CHANGE events from SAP S/4HANA cloud system to update the locally persisted BusinessPartners details. Also it writes back to SAP S/4HANA cloud system, based on the conditions (`impact >= 100000` and `priority 1`) using `cloud-sdk`. Also, listens to the CREATE events from the SAP S/4HANA system and automatically creates new Risk if the `BusinessPartners` belong to the Industry `Leisure and Hotels`.

    <!-- cpes-file srv/risk-service.js -->
```js hl_lines="5-12 24-32 34-42 44-57 64-69 71-92"
/**
 * Implementation for Risk Management service defined in ./risk-service.cds
 */
module.exports = async (srv) => {
    const messaging = await cds.connect.to('messaging');
    const db = await cds.connect.to('db');
    const BupaService = await cds.connect.to('API_BUSINESS_PARTNER');
    const { BusinessPartners: externalBP, BuPaIndustry} = srv.entities
    const { BusinessPartners } = db.entities('sap.ui.riskmanagement');
    const {BusinessPartner: sdkBusinessPartner}  = require('@sap/cloud-sdk-vdm-business-partner-service');
    const packageJson = require("../package.json");

    srv.after('READ', 'Risks', (risksData) => {
        const risks = Array.isArray(risksData) ? risksData : [risksData];
        risks.forEach(risk => {
            if (risk.impact >= 100000) {
                risk.criticality = 1;
            } else {
                risk.criticality = 2;
            }
        });
    });

    messaging.on("sap/S4HANAOD/risk/ce/sap/s4/beh/businesspartner/v1/BusinessPartner/Changed/v1", async (msg) => {
        console.log("<< event caught", msg);
        const BUSINESSPARTNER = msg.data.BusinessPartner;
        console.log('<<< Received Business Partner ' + BUSINESSPARTNER )
        const replica = await cds.tx(msg).run(SELECT.one(BusinessPartners, (n) => n.ID).where({ID: BUSINESSPARTNER}));
        if(!replica) return;
        const bp = await BupaService.tx(msg).run(SELECT.one(externalBP).where({ID: BUSINESSPARTNER}));
        if(bp) return db.tx(msg).run(UPDATE(BusinessPartners, replica.ID).with(bp));
    });

  srv.before('SAVE', 'Risks', async req => {
    const assigned = { ID: req.data.bp_ID }
    if (!assigned.ID) return
    const local = db.transaction(req)
    const [replica] = await local.read(BusinessPartners).where(assigned)
    if (replica) return
    const [bp] = await BupaService.tx(req).run(SELECT.from(externalBP).where(assigned))
    if (bp) return local.create(BusinessPartners).entries(bp)
  });

  srv.after('SAVE', 'Risks', async (data)=>{
    if(data.impact >= 100000 && data.prio == 1){
        let payload = {
            "searchTerm1": "Very High Risk",
            "businessPartnerIsBlocked": true
          }
          let payloadBuilder = sdkBusinessPartner.builder().fromJson(payload);
          payloadBuilder.businessPartner = data.bp_ID;
          let res = await sdkBusinessPartner.requestBuilder().update(payloadBuilder).execute({
            destinationName: packageJson.cds.requires.API_BUSINESS_PARTNER.credentials.destination
          });
          console.log("Search Term update", res);
    }
  });

    // srv.on('READ', 'Risks', (req, next) => {
    //     req.query.SELECT.columns = req.query.SELECT.columns.filter(({ expand, ref }) => !(expand && ref[0] === 'bp'));
    //     return next();
    // });

    srv.on('READ', 'BusinessPartners', async (req) => {
        console.log(req.query);
        let res = await BupaService.tx(req).run(req.query)
        console.log(`retrieved ${res.length} records`);
        return res
    });

    messaging.on("sap/S4HANAOD/risk/ce/sap/s4/beh/businesspartner/v1/BusinessPartner/Created/v1", async (msg) => {
      console.log("<< event caught", msg);
      let BUSINESSPARTNER = msg.data.BusinessPartner;
      const industry = await BupaService.tx(msg).run(SELECT.one(BuPaIndustry).where({BusinessPartner: BUSINESSPARTNER}))
      console.log("Belongs to Industry >> ", industry);
      if(industry && industry.IndustrySector == "73"){
        const bp = await BupaService.tx(msg).run(SELECT.one(externalBP).where({ID: BUSINESSPARTNER}));
        bp.industry = industry.IndustryKeyDescription;
        await db.tx(msg).create(BusinessPartners).entries(bp);
        createRisk(BUSINESSPARTNER, msg);
      }
    });
    async function createRisk(BUSINESSPARTNER, msg){
      const payload = {
        title: 'auto: CFR non-compliance',
        descr: 'New Business Partner might violate CFR code',
        bp_ID: BUSINESSPARTNER,
        status_value: 'NEW'
      }
      console.log("Creating auto risk with", payload);
      return cds.tx(msg).run(INSERT.into(srv.entities.Risks).entries(payload));
    }
}
```

2. Modify `package.json` to include SAP Event Mesh service instance:

    <!-- cpes-file package.json:$.cds -->
```json hl_lines="15-18 22-23 41-46 52-52"
{
  "name": "cpapp",
  "version": "1.0.0",
  "description": "A simple CAP project.",
  "repository": "<Add your repository here>",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@sap/cds": "^4.2.8",
    "@sap/hana-client": "^2.4.194",
    "@sap/xssec": "^3.0.9",
    "express": "^4",
    "passport": "^0.4.1",
    "hdb": "^0.18.1",
    "@sap/xb-msg-amqp-v100": "^0.9.39",
    "@sap-cloud-sdk/core": "^1.31.0",
    "@sap/cloud-sdk-vdm-business-partner-service": "^1.23.0"
  },
  "devDependencies": {
    "sqlite3": "^5.0.0",
    "@sap/hdi-deploy": "3.11.11",
    "ui5-middleware-simpleproxy": "^0.4.0"
  },
  "scripts": {
    "start": "npx cds run"
  },
  "sapux": [
    "app/risks",
    "app/notifications"
  ],
  "cds": {
    "requires": {
      "db": {
        "kind": "sql"
      },
      "uaa": {
        "kind": "xsuaa",
        "credentials": {}
      },
      "messaging": {
        "kind": "local-messaging",
        "[production]": {
          "kind": "enterprise-messaging-shared"
        }
      },
      "API_BUSINESS_PARTNER": {
        "kind": "odata",
        "model": "srv/external/API_BUSINESS_PARTNER",
        "credentials": {
          "destination": "cap-api098",
          "path": "/sap/opu/odata/sap/API_BUSINESS_PARTNER"
        }
      }
    },
    "hana": {
      "deploy-format": "hdbtable"
    }
  }
}
```

3. Copy the `csv` files from the folder `templates/s4h/eventing/db/data` to the `db/data` folder. The `csv` files contains the data for modified fields.

3. Copy the `em.json` file from the `templates/s4hcloud/eventing` to the root folder of the project.

4. Add SAP Event Mesh instance to the resources section of `mta.yaml`. If you have already created the instance for SAP S/4HANA, please delete that either from cockpit or using the command line as updating of instance get failed.

      ```yaml
      _schema-version: '3.1'
      ...
      - name: cpapp-ems
      parameters:
          path: ./em.json
          service: enterprise-messaging
          service-plan: default
      type: org.cloudfoundry.managed-service
      ...
      ```

5.  Add the SAP Event Mesh instance to the requires section of `cpapp-srv`.

    <!-- cpes-file mta.yaml:$.modules[?(@.name=="cpapp-srv")] -->
```yaml hl_lines="13"
_schema-version: '3.1'
...
modules:
  ...
  - name: cpapp-srv
    type: nodejs
    path: gen/srv
    requires:
      - name: cpapp-db
      - name: cpapp-uaa
      - name: cpapp-destination
      - name: cpapp-logs
      - name: cpapp-ems
    provides:
      - name: srv-api
        properties:
          srv-url: '${default-url}'
```

9. Copy the `s4cems.json` file from the `templates/s4hcloud/eventing` to the root folder of the project.

10. Add SAP S/4HANA Cloud Extensibility `messaging` instance to the resources section of `mta.yaml`. This will help to consume SAP S/4HANA Cloud events and create event-based extensions using the event bus from SAP BTP Enterprise.

      ```yaml
      _schema-version: '3.1'
      ...
      - name: cpappems4c
      parameters:
          path: ./s4cems.json
          service: s4-hana-cloud
          service-plan: messaging
          system-name: Risk-S/4HANACLOUD
      type: org.cloudfoundry.managed-service
      ...
      ```

11. Copy the `bupa.json` file from the `templates/s4hcloud/eventing` to the root folder of the project.

12. Add SAP S/4HANA Cloud Extensibility `api-access` service instance to the resources section of `mta.yaml` for generic access to SAP S/4HANA Cloud APIs:

      ```yaml
      _schema-version: '3.1'
      ...
      - name: cap-api098
      parameters:
          path: ./bupa.json
          service: s4-hana-cloud
          service-plan: api-access
          system-name: Risk-S/4HANACLOUD
      type: org.cloudfoundry.managed-service
      ...
      ```

13. To add the OData annotations, copy the file `risks-service-ui.cds` from `templates/s4hcloud/eventing/srv` to the `srv` folder of your app.

//TODO: Steps below are redundant. Moved to Events-Config-CAP-Deploy-Cloud. Should be removed when rework is completed.

14. Build the MTA module:

    ```
    mbt build -t ./
    ```

    This creates a `mtar` file `cpapp_1.0.0.mtar` in the current folder (option: `-t ./`).

15. Deploy the module to your current Cloud Foundry space.

    ```
    cf deploy cpapp_1.0.0.mtar
    ```

The result of these steps can be found [here](https://github.tools.sap/CPES/CPAppDevelopment/tree/s4cloud-eventing).

