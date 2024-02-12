---
author_name: Mahati Shankar
author_profile: https://github.com/smahati
title: Prepare for SAP BTP Development with Kyma
description: Learn how to prepare SAP BTP and Kyma for application deployment.
keywords: cap
auto_validation: true
time: 25
tags: [ tutorial>beginner, software-product-function>sap-cloud-application-programming-model, programming-tool>node-js, software-product>sap-business-technology-platform, software-product>sap-btp\\, kyma-runtime, software-product>sap-fiori]
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
 - How to check and assign entitlements
 - How to configure Kyma in your SAP BTP subaccount

---

## Overview

=== "Canary"

    **Canary:** This landscape is intended for SAP-internal development or as development stage for SAP products. It isn't intended for use by customers. Applications deployed here are accessible from outside of SAP by default.

=== "External"

    !!! caution "<!--###--> To earn your badge for the whole mission, you will need to mark all steps in a tutorial as done, including any optional ones that you may have skipped because they are not relevant for you."

    You need an SAP BTP account to deploy the services and applications.
    In general, you have a choice of the following options:

    **Trial:** *(recommended)* Use a trial account if you just want to try out things and don’t want to use any of the parts of this tutorial productively. The usage is free of cost and all the services that you need for this tutorial get automatically assigned to your trial account.

    !!! caution "When running the tutorial with a trial account, please have in mind the following considerations:"
        * Choose host region `cf-us10` when creating a new trial account. This will ensure that all services required throughout the tutorial are available to your account.
        * If you use an existing trial account, make sure the host region is different from `cf-ap21`. Otherwise, some services required throughout the tutorial might be missing from your account. To check the host region for your account, choose **About** from the dropdown under your user in the top right corner of the SAP BTP cockpit.

    **Live:** There are multiple live landscapes available in different data centers around the globe. Live landscapes are intended for productive usage and development projects.

## Create a Trial account

You can [register for a trial account](https://www.sap.com/cmp/td/sap-cloud-platform-trial.html) and access it in [SAP BTP Cockpit](https://cockpit.hanatrial.ondemand.com/cockpit#/home/trial).

A global account, a subaccount, a Cloud Foundry org, and space with some entitlements that should be sufficient to do this tutorial are set up for you. You'll only need to enable Kyma as described in the following steps. Nevertheless, let's first double check the entitlements to avoid any problems later in the tutorial. Continue with **Step 5: Check and assign entitlements** below.

## Create a Live account

If you choose to create an account on Live, you have to select a number of services that you need to subscribe to, for example, an SAP HANA database. For each service, there are so-called `entitlements`, which are basically the service plans and the number of units that you want from each service. When you create an account, you need to provide these also.

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

## Create a subaccount

1. Enter your **Global Account**. If you are using a trial account, choose **Go To Your Trial Account**.

2. Choose **Account Explorer** in the left navigation pane.

3. Choose **Create** &rarr; **Subaccount**.

    ![Create subaccount](markdown/images/create_subaccount.png)

4. In the **New Subaccount** dialog, enter a **Display Name**.

    !!! info "Use a short name for your project and add the prefix for the landscape, for example: `<project name>-cf-us10`. Don’t select the checkbox **Neo**!"

5. Enter a subdomain.

    !!! info "Only valid HTTP domain characters are allowed."

6. Choose **Create**.

7. Wait for the completion of the subaccount creation.

8. Choose the tile with your new subaccount.


## Check and assign entitlements

In this section, you assign a portion of the entitlements that you’ve bought for your global account to the individual subaccounts. In this example, you have only one subaccount. However, if you have 3 subaccounts, for example, and have bought 100 units of the HTML5 service, you could assign 50 units to the first subaccount, 20 to the second, and the remaining 30 to the third subaccount.

The following services with their service plans and entitlements are required for the different tutorial modules and will be needed throughout the tutorial.


{! includes/SAP-BTP-Entitlements-Kyma.md !}


1. In your subaccount, choose **Entitlements** in the left-hand pane.

2. Choose **Configure Entitlements**.

3. Choose **Add Service Plans**.

4. Go through the entitlements according to the table above and check/add the required plans for each of them.

5. Choose the **+** or **-** symbol to change the quota for the services according to the table.

6. Choose **Save**.

!!! warning "In case you face a problem when creating a service instance or subscribing to an application later in the tutorial, please make sure you've added all entitlements listed in the table above."

## Configure Kyma in your subaccount

This creates in your subaccount a Kyma instance that is a complete Kubernetes cluster with Kyma on top.

1. In your subaccount's **Overview** page, choose the **Kyma Environment** tab and choose **Enable Kyma**.

    ![Enable Kyma](markdown/images/enable_kyma.png)

2. In the **Enable Kyma** dialog, a plan, an instance name, and a cluster name are automatically filled for you. You can keep the default settings and choose **Create**.


    ![Set plan, instance name, and cluster name](markdown/images/kyma_instance_name.png)

    !!! info "Prefer to use a different instance name?"
        We recommend you use a CLI-friendly name to enable the managing of your instances with the SAP BTP command line interface as well.

        A CLI-friendly name is a short string (up to 32 characters) that contains only alphanumeric characters (A-Z, a-z, 0-9), periods, underscores, and hyphens. It can't contain white spaces.

        As mentioned above, when you create an environment instance that enables an environment you want to use, the name is generated automatically for you. You can use that name or replace it with the name of your choice.

3. The creation of the cluster takes some time. When done, you should see a `Console URL`, a `KubeconfigURL`, and the name of your cluster.

    ![Kyma Enabled](markdown/images/kyma_enabled.png)

## Enable the Btp-Operator Module for your Kyma Cluster

You need to enable the **btp-operator** module for your Kyma cluster so you can map your SAP HANA Cloud service instance to the Kyma cluster. Follow the steps below:

1. Navigate to your subaccount and choose **Link to dashboard** under the **Kyma Environment** tab to go to the dashboard page.

2. On the dashboard page, click on modify in the **installed modules** table header.

      <!-- border; size:540px --> ![modify installed modules](markdown/images/kyma-modify-modules.png)

2. Choose **Edit**.

      <!-- border; size:540px --> ![click on edit to allow changing default modules](markdown/images/kyma-default-edit.png)

4. Select the checkbox for **btp-operator** under **Modules** and choose **Update**.

      <!-- border; size:540px --> ![add btp-operator by checking the box and clicking update](markdown/images/kyma-default-update.png)

> You can find more info in [Enable and Disable a Kyma Module](https://help.sap.com/docs/btp/sap-business-technology-platform/enable-and-disable-kyma-module).

<!-- [VALIDATE_1] -->


