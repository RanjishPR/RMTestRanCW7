# Common Issues

## Error @sap/fiori:deploy-config ...
```bash
Error @sap/fiori:deploy-config cf --base ui5.yaml --config ui5-deploy.yaml 
Multi-target application not found
Do you need to install @sap/generator-fiori globally?
```
### Reason
Even if the extensions are updated the generators may not be.

### Solution

Trigger updates of the generators:
1. In VS Code, invoke the Command Palette ( View → Command Palette or Shift + Command + P for macOS / Ctrl + Shift + P for Windows) and choose Fiori: Open Application Generator.
2. Click on the link "Explore and Install Generators".
3. Next to search for Generators input field there is a dropdown called "Search Shortcuts", click on the dropdown and select "SAP Fiori".
VS Code should install and updates for generators if available.

## Error Service operation failed...

There are a couple of different error if type `Service operation failed...`. They are generally caused by missing entitlements for one service or another in your BTP account. More details for the different errors below.

### ...Updating service "cpapp-db" failed:...Error creating service "cpapp-db" from offering "hana" and plan "hdi-shared"...

```bash
Service operation failed: Controller operation failed: 404 Updating service "cpapp-db" failed: Not Found: Error creating service "cpapp-db" from offering "hana" and plan "hdi-shared": Service plan hdi-shared not found.
```

#### Reason
Missing entitlement for service **SAP HANA Schemas & HDI Containers**

| Service                           | Plan       | Amount | Unit         | 
| --------------------------------- | ---------- | ------ | ------------ | 
| SAP HANA Schemas & HDI Containers | `hdi-shared` | 1      | instances    | 

#### Solution

Follow the steps in [Check and assign entitlements](https://developers.sap.com/tutorials/btp-app-prepare-btp.html#14c6c662-3368-48ce-859e-1a608c78f7a5) to add the missing entitlements.


### ...Updating service "cpapp-uaa" failed:...Error creating service "cpapp-uaa" from offering "xsuaa" and plan "application"...

```bash
Service operation failed: Controller operation failed: 404 Updating service "cpapp-uaa" failed: Not Found: Error creating service "cpapp-uaa" from offering "xsuaa" and plan "application": Service plan application not found.
```

#### Reason
Missing entitlement for **SAP Authorization and Trust Management service**

| Service                           | Plan       | Amount | Unit         | 
| --------------------------------- | ---------- | ------ | ------------ | 
| SAP Authorization and Trust Management service | `application` | 1      | instances    | 

#### Solution

Follow the steps in [Check and assign entitlements](https://developers.sap.com/tutorials/btp-app-prepare-btp.html#14c6c662-3368-48ce-859e-1a608c78f7a5) to add the missing entitlements.
## Cannot find service plan
When setting up your account you do not find the service plans mentioned.

### Reason
You might not be using a trial account and your subscription does not include the service plans.

### Solution
Update the subscription to add all the relevant plans.

---

### cds not found
After deployment you get this message in the application logs.

### Reason
You might not have the right version of node being used.

### Solution
update the version of node being used in the package.json, rebuild and redeploy.

---

# Archive of older issues

## Error could not update the ***.temp.mta.yaml file it was modified by another process

### Reason
This issue has not been confirmed or reproduced consistently so the reason is unsure.

### Solution
Users report that downgrading mta@1.0.5 to mta@1.0.4 fixes the issue.
`npm i -g mta@1.0.4`
