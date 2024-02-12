# Set Up Your CAP Application for Eventing

## Prerequisites
 - [Add the Consumption of an External Service to Your CAP Application](../Ext-Service-Add-Consumption)
 - [Consume the External Service in the UI of Your Application](../Ext-Service-Consume-UI)
 - [Prepare SAP S/4HANA System by Activating the Business Partner OData Service](../Ext-Service-OData-Service)
 - [Configure Systems in Cloud Connector](../Ext-Service-Cloud-Connector)
 - [Add Services and Consume an External Service from SAP S/4HANA](../Ext-Service-S4HANA-Consume)


## Details
### You will learn
 - How to adapt your CAP application for eventing
 - How to locally test your changes
---

## Adapt your CAP application for eventing

1. Add the following properties and persistence for `BusinessPartners` entity in `db/schema.cds`:

    <!-- cpes-file db/schema.cds -->
```text hl_lines="13 20-24"
namespace sap.ui.riskmanagement;
using { managed } from '@sap/cds/common';

  entity Risks : managed {
    key ID      : UUID  @(Core.Computed : true);
    title       : String(100);
    prio        : String(5);
    descr       : String;
    miti        : Association to Mitigations;
    impact      : Integer;
    criticality : Integer;
    supplier    : Association to Suppliers;
    status: Association to StatusValues;
  }

  entity Mitigations : managed {
    ...
  }

  @cds.autoexpose
  entity StatusValues {
    key value:String;
    criticality: Integer;
  }

using {  API_BUSINESS_PARTNER as bupa } from '../srv/external/API_BUSINESS_PARTNER';
   ...
}

```

2. Next, you have to configure the CAP service to listen to incoming events. Add the following code to `srv/risk-service.js`:

    <!-- cpes-file srv/risk-service.js -->
```js hl_lines="8-42"

const cds = require('@sap/cds')

/**
 * Implementation for Risk Management service defined in ./risk-service.cds
 */
module.exports = cds.service.impl(async function() {
  ...
  this.after('UPDATE', 'Risks', async (riskData, req) => {
        const { Risks } = cds.entities;
        riskData.status_value = 'ASSESSED';
        await cds.tx(req).run(UPDATE(Risks).set({status_value: 'ASSESSED'}).where({ID: riskData.ID}));
    });

    // Here we need to add the required code that does create / update the risk
    bupa.on( 'Created', msg => {
        const { Risks } = cds.entities;
        const { BusinessPartner } = msg.data;
        console.log('Received created! BusinessPartner=' + BusinessPartner);
        createRisk(BusinessPartner, msg);
    });

    bupa.on( 'Changed', msg => {
        const { Risks } = cds.entities;
        const { BusinessPartner } = msg.data;
        console.log('Received changed! BusinessPartner=' + BusinessPartner);
        cds.tx(msg).run(UPDATE(Risks).set({status_value: 'CHANGED'}).where({'Supplier_ID' : BusinessPartner}));
    });

    function createRisk( BUSINESSPARTNER, msg) {
        const { Risks } = cds.entities;
        const payload = {
            title: 'auto: CFR non-compliance',
            descr: 'New Business Partner might violate CFR code',
            prio: 1,
            miti_id: '20466921-7d57-4e76-b14c-e53fd97dcb13',
            impact: 200000,
            supplier_ID: BUSINESSPARTNER,
            status_value: 'NEW'
        }
        console.log("Creating auto risk with", payload);
        cds.tx(msg).run(INSERT.into(Risks).entries(payload));
    }
});
```

3. Copy the files from `templates/s4h/eventing/srv/external` to the `srv/external` folder. These will add the event definitions from the external S/4HANA events.

4. Add the local messaging configuration to `package.json`:

    <!-- cpes-file package.json:$.cds -->
```json hl_lines="8 10-18"
{
  ...
  "cds": {
    "requires": {
      ...
      "API_BUSINESS_PARTNER": {
        "kind": "odata-v2",
        "model": "srv/external/API_BUSINESS_PARTNER-extended",
        ...
      },
      "messaging": {
        "kind": "local-messaging",
        "[production]": {
            "kind": "enterprise-messaging-shared",
            "format": "cloudevents",
            "publishPrefix": "$namespace/ce/",
            "subscribePrefix": "+/+/+/ce/"
        }
      }
    },
    ...
  }
}
```

4. Copy `sap.ui.riskmanagement-StatusValues.csv` from the folder `templates/s4h/eventing/db/data` to the `db/data` folder. The `csv` file contains the data for the new status field.

5. To add the new status field to the UI, copy the file `risks-service-ui.cds` from `templates/s4h/eventing/srv` to the `srv` folder of your app.

## Test your changes locally

6. Run `cds watch` and open the **Risks** application: [http://localhost:4004/launchpage.html#risks-app](http://localhost:4004/launchpage.html#risks-app).

7. Choose **Go** and login to see the new status fields.

      - **Username**: `risk.manager@tester.sap.com`
      - **Password**: `initial`

      ![Login to the Risks App](../)



    !!! tip "More info in [Access the Risks application with password](../CAP-Roles/#access-the-risks-application-with-password)."



7. You have added logic to create a new risk when a new business partner is created. This is achieved by listening to events from the S/4HANA system. To test this locally simulate a business partner creation event by running the command `curl -H 'Content-Type: application/json' -X POST "http://localhost:4004/api-business-partner/A_BusinessPartner" --data '{"BusinessPartner": "123","BusinessPartnerFullName": "New"}'`

8. Click on back and open the risks tile then click on go to reload the risks. A new risk with the status new will be seen.

9. You have also added logic to update our risks when business partners are updated. To test this simulate a business partner update event by running the command `curl -H 'Content-Type: application/json' -X PATCH "http://localhost:4004/api-business-partner/A_BusinessPartner(BusinessPartner='123')" --data '{"BusinessPartnerFullName": "Changed"}'`

10. Reload the risks again and you can see that the risk status is now `Changed`.

11. Click on edit and update the impact field to 0, then click on save. The status is updated to `assessed`.

The results of these steps can be found [here](https://github.tools.sap/CPES/CPAppDevelopment/tree/s4h/eventing).

