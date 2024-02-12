# Fix CAP application based on observations

The below Code srv -> risk-service.js file is using bad coding practice and resulted in high response time. It loops and selects 20 business partners from SAP S/4 HANA Cloud calling the destination multiple times.

```
    const BupaService = await cds.connect.to('API_BUSINESS_PARTNER');
    srv.on('READ', srv.entities.BusinessPartners, async (req) => {
        var businesspartners = await BupaService.tx(req).run(req.query);

        const businesspartnerreduced = await businesspartners.slice(1, 20).reduce(async (prevaccumulator, buisspart, idx) => {
            const collection = await prevaccumulator;

            const bp = await BupaService.tx(req).run(SELECT.from(BupaService.entities.A_BusinessPartner.name, [
                'BusinessPartner', 'LastName', 'FirstName'
            ]).where({
                BusinessPartner: {
                    '=': buisspart.BusinessPartner
                }
            }));
            if (bp) {
                collection.push(bp[0]);
            }
            return collection;
        }, Promise.resolve([]));
        return businesspartnerreduced;
    });
```   

Replace the above code with below code which will avoid this response lag.

```
     const BupaService = await cds.connect.to('API_BUSINESS_PARTNER');
     srv.on('READ', srv.entities.BusinessPartners, async (req) => {
         const query = req.query;
         const redirect = query.redirectTo(BupaService.entities.A_BusinessPartner);
         const res = await BupaService.tx(req).run(
             redirect
         );
         return res;
     });
```
Once you have changed the piece of code, Deploy the application to Cloud Foundry and Monitor the response time in Dynatrace.
