---
author_name: Mahati Shankar
author_profile: https://github.com/smahati
title: Set Up SAP HANA Cloud for Kyma
description: Learn how to add SAP HANA client and configuration, create an HDI container for an SAP HANA Cloud instance on Cloud Foundry, and create credentials for the Cloud Foundry SAP HANA Cloud instance in your Kyma cluster.
keywords: cap
auto_validation: true
time: 5
tags: [ tutorial>beginner, software-product-function>sap-cloud-application-programming-model, programming-tool>node-js, software-product>sap-business-technology-platform, software-product>sap-btp\\, kyma-runtime, software-product>sap-fiori]
primary_tag: software-product-function>sap-cloud-application-programming-model
---

## Prerequisites
 - [Prepare Your Kyma Development Environment](../Kyma-Prepare-Dev-Environment)
 - You can set up a new SAP HANA Cloud service instance as per [Step 2 (Optional) Create an SAP HANA Cloud service instance](../HANA-Cloud-Setup) or use an existing SAP HANA Cloud service instance as described in [Step 3 (Optional) Use an existing SAP HANA Cloud service instance](../HANA-Cloud-Setup)


## Details
### You will learn
 - How to create an HDI container for an SAP HANA Cloud service instance on Cloud Foundry and create credentials for the SAP HANA cloud service instance in your Kyma cluster.

---

## Overview

=== "External"

    !!! caution "<!--###--> To earn your badge for the whole mission, you will need to mark all steps in a tutorial as done, including any optional ones that you may have skipped because they are not relevant for you."

Setting up an SAP HANA Cloud service instance directly on Kyma is not possible for trial accounts. Hence, in this tutorial, you will set up an SAP HANA Cloud service instance on Cloud Foundry (or use an existing one). Afterwards, we'll create an HDI container on Cloud Foundry and will use a script in the templates to create credentials for the SAP HANA Cloud service instance in your Kyma cluster.

!!! note "For non-trial accounts you can create a mapping from the Kyma Dashboard:"
    [Create Service Instances for SAP HANA Cloud](https://cap.cloud.sap/docs/guides/deployment/deploy-to-kyma?q=kyma+hana#hana-cloud-instance) in Capire


## Add SAP HANA client and configuration to your project

1. Add SAP HANA support to your project by running:

    ```bash
    cds add hana --for production
    ```

    This adds the `db` module for SAP HANA access to your `package.json` file.

2. Check the changes in the `package.json` file done by `cds add hana`:

    <!-- cpes-file package.json:$.cds -->
    ```json hl_lines="4-10"
    {
        "name": "cpapp",
        ...
        "cds": {
            "requires": {
                "[production]": {
                    "db": "hana"
                }
            }
        }
    }
    ```

3. In the generated code, update "hana" to "hana-cloud".

## Set Up SAP HANA Cloud

1. Make sure that your HANA instance described in the pre-requisites is running.
2. Make sure you're logged in both your Cloud Foundry space and your Kyma cluster.

    - Cloud Foundry: run `cf login` and provide credentials. As an alternative, you can directly run `cf login --sso`. You'll have to follow a link to get a temporary authentication code that you can provide instead of manually entering credentials.
    - Kyma: you should be already logged in, if you've followed the instructions in `Step 4: Login to your Kyma cluster` of [Prepare Your Kyma Development Environment](../Kyma-Prepare-Dev-Environment). If you want to double check, run a simple command to see if you get any output. For example, if you run `kubectl get secret`, you should get an output similar to the one in `Step 6: Create container registry secret` of [Prepare Your Kyma Development Environment](../Kyma-Prepare-Dev-Environment).

3. In the root folder of your project, execute:

    ```bash
    ./scripts/create-db-secret.sh cpapp-db
    ```

    What happens here? The script completes several tasks:

    - Creates an HDI container on your already existing SAP HANA Cloud service instance in your Cloud Foundry space. This is represented by an SAP HANA Cloud service instance with plan `hdi-shared`. If you use the name `cpapp` for your project, then this service should be called `cpapp-db`.
    - Creates a service key (`cpapp-db-key` if your HDI container service is called `cpapp-db`) on Cloud Foundry.
    - Creates a secret with the service key's credentials on your Kyma cluster.

!!! caution "If you get an error, make sure you've added all required entitlements to your subaccount as described in `Step 3: Create a Live Account` of [Prepare for SAP BTP Development](../Kyma-Prepare-BTP)."

<!-- [VALIDATE_1] -->
