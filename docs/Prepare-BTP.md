---
author_name: Mahati Shankar
author_profile: https://github.com/smahati
title: Prepare for SAP BTP Development
description: Learn how to prepare SAP BTP and Cloud Foundry for application deployment.
keywords: cap
auto_validation: true
time: 15
tags: [ tutorial>beginner, software-product-function>sap-cloud-application-programming-model, programming-tool>node-js, software-product>sap-business-technology-platform, software-product>sap-fiori]
primary_tag: software-product-function>sap-cloud-application-programming-model
---

## Prerequisites
 - [Prepare Your Development Environment for CAP](../Prepare-Dev-Environment-CAP)
 - Before you start with this tutorial, you have two options:
    - Follow the instructions in **Step 16: Start from an example branch** of [Prepare Your Development Environment for CAP](../Prepare-Dev-Environment-CAP) to checkout the [`cap-roles`](https://github.com/SAP-samples/cloud-cap-risk-management/tree/cap-roles) branch.
	- Complete the group of tutorials [Create a CAP Application and SAP Fiori UI](https://developers.sap.com/group.btp-app-cap-create.html).

## Details
### You will learn
 - How to create an account for SAP BTP
 - How to configure Cloud Foundry in your SAP BTP subaccount
 - How to check and assign entitlements
---

## Overview

=== "Canary"

    **Canary:** This landscape is intended for SAP-internal development or as development stage for SAP products. It isn't intended for use by customers. Applications deployed here are accessible from outside of SAP by default.

=== "External"

    !!! caution "<!--###--> To earn your badge for the whole mission, you will need to mark all steps in a tutorial as done, including any optional ones that you may have skipped because they are not relevant for you."

    You need an SAP BTP account to deploy the services and applications. 
    
    In general, you have a choice of the following alternative options:

    **Trial:** *(recommended)* Use a trial account if you just want to try out things and don’t want to use any of the parts of this tutorial productively. The usage is free of cost and all the services that you need for this tutorial get automatically assigned to your trial account.

    !!! caution "When running the tutorial with a trial account, please have in mind the following considerations:"
        * Choose region `US East (VA) - AWS` when creating a new trial account. This will ensure that all services required throughout the tutorial are available to your account.
        * If you use an existing trial account, make sure the region is different from `Singapore - Azure`. Otherwise, some services required throughout the tutorial might be missing from your account. You can check the region for your subaccount on your subaccount's **Overview** page.

    **Live:** *(alternative)* There are multiple live landscapes available in different data centers around the globe. Live landscapes are intended for productive usage and development projects.


## Create a Trial Account

Use a trial account if you just want to try out things and don’t want to use any of the parts of this tutorial productively. Alternatively, if you're planning to use this tutorial productively, skip this step and proceed with **Step 3: Create a Live Account** below.

You can [register for a trial account](https://cockpit.hanatrial.ondemand.com/cockpit#/home/trial) or [access your existing trial account](https://cockpit.hanatrial.ondemand.com/cockpit#/home/trial).

When creating a trial account, a global account, a subaccount, a Cloud Foundry org, and space with some entitlements are set up for you. This setup is sufficient to do the tutorial.

Continue with **Step 8: Check and assign entitlements** below.

## (Alternative) Create a Live Account

If you just want to try out things and don’t want to use any of the parts of this tutorial productively, skip this step and go to **Step 2: Create a Trial Account** above.
There are multiple live landscapes available in different data centers around the globe. Live landscapes are intended for productive usage and development projects. 

If you choose to create an account on Live, you have to select a number of services that you need to subscribe to, for example, an SAP HANA database. For each service, there are so-called `entitlements`, which are basically the service plans and the number of units that you want from each service. When you create an account, you need to provide these also.

<!-- [VALIDATE_1] -->

=== "SAP"

    ### Create a Global account

    Once you have all the entitlements described in the previous step, you'll be ready to deploy the service. However, first you need to create an SAP BTP global account, a subaccount, a Cloud Foundry space, and actually assign the required entitlements.

    1. Go to **SAP BTP Control Center**.


        [https://int.controlcenter.ondemand.com/index.html](https://int.controlcenter.ondemand.com/index.html)


    2. Choose the (&#x2B;) button in the upper right corner.

    #### Enter account info

    1. Enter a global account name.

    2. Enter a description.

    3. (Optional) If you have a [Service Inventory ID](https://jtrack.wdf.sap.corp/browse/SERVICE), choose the radio button **Yes** under the section **Service Provider Account** and enter it.


    4. Choose **Next**.

    #### Enter business info

    1. Enter the cost center number.

    2. Read & check the disclaimer.

    3. Choose **Next**.

    #### Assign services

    1. Select the services specified in the table in the previous step **Create a Live Account**.

    2. Choose **Next**.

    #### Set entitlements

    1. Set the entitlements from the table in the previous step **Create a Live Account**.

    2. Choose the **Add** button for each of them.

    3. Choose **Create Account**.

### Create a subaccount

!!! info "If you are using a trial account, a subaccount is already set up for you as part of the trial account creation process."

1. Enter your **Global Account**. If you are using a trial account, choose **Go To Your Trial Account**.

2. Choose **Account Explorer** in the left navigation pane.

3. Choose **Create** &rarr; **Subaccount**.

    ![Create subaccount](markdown/images/create_subaccount.png)

4. To fill the **New Subaccount** dialog, enter a **Display Name**.

    !!! info "Use a short name for your project and add the prefix for the landscape, for example: `<project name>-cf-us10`. Don’t select the checkbox **Neo**!"

5. Enter a subdomain.

    !!! info "Only valid HTTP domain characters are allowed."

6. Choose **Create**.

7. Wait for the completion of the subaccount creation.

8. Choose the tile with your new subaccount.

### Configure Cloud Foundry in your subaccount

!!! info "If you are using a trial account, a Cloud Foundry org is already set up for you as part of the trial account creation process."


This creates a [Cloud Foundry (CF) Org](https://docs.cloudfoundry.org/concepts/roles.html#orgs) in your subaccount. There’s always one Cloud Foundry org per subaccount. Later on, when you log on to Cloud Foundry, it asks you which Cloud Foundry org you want to log on to. For any development in your subaccount, you need to choose this org for your subaccount.

1. Choose **Enable Cloud Foundry**.

2. Change the default value for **Org Name** as required and choose **Create**.



### Create a Cloud Foundry space

!!! info "If you are using a trial account, a space in your Cloud Foundry org is already set up for you as part of the trial account creation process."


Next to Cloud Foundry orgs there are also [Spaces](https://docs.cloudfoundry.org/concepts/roles.html#spaces). Each Cloud Foundry org can have 0 to n spaces, you create just one here.

1. Open the subaccount page in SAP BTP cockpit.

2. Choose **Spaces** in the left pane under the section **Cloud Foundry**.

3. Choose **Create Space**.

4. Enter a space name.

    !!! info "If different sub projects exist in the org, use `<sub project name>-<stage name>`, otherwise use `<stage name>`; where stage name is the release stage, for example: `dev`, `val`, `prod`."

5. Choose **Create**.

### (Optional) Check and assign users in the Cloud Foundry space

1. Open the **Spaces** overview in SAP BTP cockpit. You can just choose the tile for the space that was created.

2. Choose **Members** in the left navigation pane. You'll see your own user that's automatically assigned as Space Manager and Space Developer. 

3. (Optional) Choose **Add Members** to add additional users as required. Again, your own user should already be part of the list.

4. (Optional) Add a distribution list of your `CFDeployment` technical user as Space Manager if you have one.

## Check and assign entitlements

If you are using a trial account, the entitlements needed for this tutorial are already assigned as part of the trial account creation process and you can just double-check if everything is correct.

If you are using a live account, in this section you assign a portion of the entitlements that you’ve bought for your global account to the individual subaccounts. In this example, you have only one subaccount. However, if you have 3 subaccounts, for example, and have bought 100 units of the HTML5 service, you could assign 50 units to the first subaccount, 20 to the second, and the remaining 30 to the third subaccount.

The following services with their service plans and entitlements are required for the different tutorial modules and will be needed throughout the tutorial.

{! includes/SAP-BTP-Entitlements.md !}

1. In your subaccount, choose **Entitlements** in the left-hand pane.

2. Choose **Configure Entitlements**.

3. Choose **Add Service Plans**.

4. Go through the Entitlements according to the table above and check/add the required plans for each of them.

5. Choose the **+** or **-** symbol to change the quota for the services according to the table.

6. Choose **Save**.

!!! warning "In case you face a problem when creating a service instance or subscribing to an application later in the tutorial, please make sure you've added all entitlements listed in the table above."

## Log on from the command line

Prepare for the next steps by logging on to Cloud Foundry and targeting your space in the account.

{!CF-Logon.md!}

