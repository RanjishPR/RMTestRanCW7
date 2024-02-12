# [draft] Complete CAP Service Configuration for SAP S/4HANA

In this tutorial, you will configure your CAP service to listen for upcoming events and deploy it to SAP BTP cockpit.

## Configure CAP service

3. Configure the CAP service to listen to incoming events by adding the following code to `srv/risk-service.js`:

    <!-- cpes-file srv/risk-service.js -->
```js hl_lines="5-12 23-38 40-48 50-63 71-74 77-106"
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

    messaging.on(["refapps/cpappems/abc/BO/BusinessPartner/Changed", "refapps/cpappems/abc/ce/sap/s4/beh/businesspartner/v1/BusinessPartner/Changed/v1"], async (msg) => {
        console.log("<< event caught", msg);
        let BUSINESSPARTNER=""
        if(msg.headers && msg.headers.specversion == "1.0"){
       //> Fix for 2020 on-premise
          BUSINESSPARTNER = (+(msg.data.BusinessPartner)).toString();
        }
        else{
          BUSINESSPARTNER = (+(msg.data.KEY[0].BUSINESSPARTNER)).toString();
        }
        const replica = await cds.tx(msg).run(SELECT.one(BusinessPartners, (n) => n.ID).where({ID: BUSINESSPARTNER}));
        if(!replica) return;
        const bp = await BupaService.tx(msg).run(SELECT.one(externalBP).where({ID: BUSINESSPARTNER}));
        const {UPDATE} = cds.ql(msg);
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
          let res = await sdkBusinessPartner.requestBuilder().update(payloadBuilder).withCustomServicePath("/").execute({
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

    messaging.on(["refapps/cpappems/abc/BO/BusinessPartner/Created", "refapps/cpappems/abc/ce/sap/s4/beh/businesspartner/v1/BusinessPartner/Created/v1"], async (msg) => {
      console.log("<< event caught", msg);
      let BUSINESSPARTNER=""
      if(msg.headers && msg.headers.specversion == "1.0"){
     //> Fix for 2020 on-premise
        BUSINESSPARTNER = (+(msg.data.BusinessPartner)).toString();
      }
      else{
        BUSINESSPARTNER = (+(msg.data.KEY[0].BUSINESSPARTNER)).toString();
      }
      const industry = await BupaService.tx(msg).run(SELECT.one(BuPaIndustry).where({BusinessPartner: BUSINESSPARTNER}))
      console.log("Belongs to Industry >> ", industry);
      if(industry && industry.IndustrySector == "73"){
        const bp = await BupaService.tx(msg).run(SELECT.one(externalBP).where({ID: BUSINESSPARTNER}));
        bp.industry = industry.IndustryKeyDescription;
        await db.tx(msg).create(BusinessPartners).entries(bp);
        await createRisk(BUSINESSPARTNER, msg);
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

Align the previous mentioned changes in your code or copy paste the whole section of code. These changes include the logic of persisting `BusinessPartners` based on the selection in the Value Help and configure your application to listen for CHANGE events from the SAP S/4HANA system to update the locally persisted business partner details. It also writes back onto the SAP S/4HANA system based on the conditions (`impact >= 100000` and `priority 1`) using `cloud-sdk`.
Also, listens to the CREATE events from the SAP S/4HANA system and automatically creates new Risk if the `BusinessPartners` belong to the Industry `Leisure and Hotels`.

## Deploy to SAP BTP cockpit

10. Build the MTA module:

    ```
    mbt build -t ./
    ```

    This creates an `mtar` file named `cpapp_1.0.0.mtar` in the current folder (option: `-t ./`).

11. Deploy the module to your current Cloud Foundry space:

    ```
    cf deploy cpapp_1.0.0.mtar
    ```