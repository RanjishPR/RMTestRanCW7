---
author_name: Mahati Shankar
author_profile: https://github.com/smahati
title: Register Your SAP S/4HANA Cloud System
description: This tutorial shows you how to register your SAP S/4HANA Cloud system in your SAP BTP cockpit.
keywords: cap
auto_validation: true
time: 15
tags: [tutorial>intermediate, tutorial>license, software-product-function>sap-cloud-application-programming-model, programming-tool>node-js, software-product>sap-business-technology-platform, software-product>sap-api-management, software-product>sap-hana-cloud, software-product>sap-s-4hana-cloud]
primary_tag: software-product-function>sap-cloud-application-programming-model
---
## Prerequisites
 - [Consume the External Service in the UI of Your Application](../Ext-Service-Consume-UI)
 - On SAP BTP side:
    - You have an [enterprise](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/171511cc425c4e079d0684936486eee6.html) global account in SAP BTP.
    - You must be an administrator of the SAP BTP global account where you want to register your SAP S/4HANA Cloud system.
    - Your SAP BTP subaccount has quota for the services `SAP Build Work Zone, standard edition` and `SAP HTML5 Applications Repository service` as described in [Prepare for SAP BTP Development](../Prepare-BTP).
    - You can set up a new SAP HANA Cloud service instance as per [Step 2 (Optional) Create an SAP HANA Cloud service instance](../HANA-Cloud-Setup) or use an existing SAP HANA Cloud service instance as described in [Step 3 (Optional) Use an existing SAP HANA Cloud service instance](../HANA-Cloud-Setup). After the deployment, you need to [Subscribe to the SAP Build Work Zone, Standard Edition](../Work-Zone-Subscribe).
 - On SAP S/4HANA Cloud side:
    - You have a dedicated SAP S/4HANA Cloud tenant.
    - You must be an administrator of the SAP S/4HANA Cloud system.
    - You need to connect this system to your SAP BTP global account, if you'd like to build extension applications for your SAP S/4HANA Cloud system.

<!--INTERNAL

(IMPORTANT: You need to use [AWS Canary landscape](https://cockpit.sap.hana.ondemand.com/cockpit/#/globalaccount/6a8e3c4e-77ea-482c-b37b-4ce687a8bfe0/accountModel&//?section=SubaccountsSection&view=TilesView) - required quotas can be added in the [Control Center](https://int.controlcenter.ondemand.com/index.html))

      TODO: Doesn't work. Checking with responsible

      ## Get an SAP S/4HANA Cloud System

      1. Open [https://www.sap.com/products/s4hana-erp/trial.html](https://www.sap.com/products/s4hana-erp/trial.html).
      1. Choose **Start your 14-day cloud trial**.
      2. Register ...
      3. Choose **Click here to start your trial**.
-->

## Details
### You will learn
 - How to acquire an SAP BTP integration token
 - How to add integration token to SAP S/4HANA Cloud system
 - How to set up entitlements for your SAP BTP subaccount
---

## Acquire an SAP BTP integration token for registration

1. In your SAP BTP cockpit, navigate to **System Landscape**.

2. In the **System Landscape** panel, choose **Add System**.

3. In the **Add System** popup, enter the **System Name** for the SAP S/4HANA Cloud system `CPAPP_S4HANA_CLOUD`.

4. In the dropdown list for **Type**, choose `SAP S/4HANA Cloud`.

5. Choose **Add**.

      ![s4h1](markdown/images/s4cloud/s4h1.png)

6. In the dropdown list for **Communication Scenario Groups**, Choose **All Communication Scenarios**.

      ![s4h1](markdown/images/s4cloud/s4h1_get_token.png)

6. Choose **Get Token**.

      ![s4h1](markdown/images/s4cloud/s4h1_get_token2.png)

7. Copy the generated token and keep this page open.

      ![s4h2](markdown/images/s4cloud/s4h2.png)

## Add integration token to SAP S/4HANA Cloud system

1. Log on to your SAP S/4HANA Cloud tenant.

2. Navigate from **Home** &rarr; **Communication Management** tab and choose the tile **Maintain Extensions on SAP BTP**.

      ![s4h3](markdown/images/s4cloud/s4h3.png)

3. On **Maintain Extensions on SAP BTP** screen in the **Extensions** section, choose **New**.


      ![s4h4](markdown/images/s4cloud/s4h4.png)

4. In the **Integration Token** field, paste in the integration token generated from SAP BTP (see previous steps 5 and 7).

5. Enter a **Description** for your system integration token: `SAP S/4HANA Cloud for Risk Management`.

      ![s4h5](markdown/images/s4cloud/s4h5.png)

6. Choose **Create**, then choose **Yes** to approve the creation, and wait until the status displayed for your newly registered system switches to **Enabled** – it's possible that you would need to refresh your page.

      ![s4h6](markdown/images/s4cloud/s4h6.png)

7. Switch back to the **System Landscape** page in SAP BTP cockpit.

8. Close the dialog with the integration token.

9. You may need to refresh your page, the new system will be as an entry in the list of **Systems**.

      ![s4h7](markdown/images/s4cloud/s4h7.png)

   Now, the system is registered with your SAP BTP Global account.

## Set up entitlements for your SAP BTP subaccount

After you have connected the SAP S/4HANA Cloud system to SAP BTP (with status **Enabled** in your SAP S/4HANA Cloud tenant), you need to configure entitlements to make this system accessible in the SAP BTP subaccount in which you want to build your extension application. You configure the entitlements and assign the corresponding quota and service plans to the subaccount in which the extension application will reside.

1. Enter your **Global Account**.

2. Choose **Entitlements** &rarr; **Entity Assignments**.

      ![Entity Assignments](markdown/images/s4cloud/entity_assignments.png)

3. Search for your subaccount in the **Select Entities** field.

4. Select your subaccount.

      ![Select Subaccount](markdown/images/s4cloud/select_subaccount.png)

5. Choose **Configure Entitlements** &rarr; **Add Service Plans**.

      ![s4h9](markdown/images/s4cloud/s4h9.png)

6. In the **Subaccount `<your-subaccount-name>` Entitlements** dialog box, select the service **SAP S/4HANA Cloud Extensibility**.

7. In the **Service Details: SAP S/4HANA Cloud Extensibility** screen area, select your newly registered system name from the dropdown help to list the **Available Plans**.

      - **messaging** – to consume SAP S/4HANA Cloud events and create event-based extensions using the event bus from SAP Event Mesh Integration

      - **api-access** – for generic access for SAP S/4HANA Cloud APIs

8. Select both service plans.

9. Choose **Add 2 Service Plans** to add these entitlements for the SAP S/4HANA Cloud Extensibility service for your SAP S/4HANA Cloud system registered to your subaccount.

      ![s4h10](markdown/images/s4cloud/s4h10.png)

10. Choose **Save**.

      ![s4h11](markdown/images/s4cloud/s4h11.png)


<!-- [VALIDATE_1] -->