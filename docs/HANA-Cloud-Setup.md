---
author_name: Mahati Shankar
author_profile: https://github.com/smahati
title: Set Up the SAP HANA Cloud Service
description: This tutorial shows you how to set up the SAP HANA cloud service instance.
keywords: cap
auto_validation: true
time: 25
tags: [ tutorial>beginner, software-product-function>sap-cloud-application-programming-model, programming-tool>node-js, software-product>sap-business-technology-platform, software-product>sap-hana-cloud]
primary_tag: software-product-function>sap-cloud-application-programming-model
---

## Prerequisites
 - [Add SAP HANA Support to Your Project](../HANA-App-Setup)


## Details
### You will learn
 - How to set up the SAP HANA Cloud service instance

---

## Prepare to use SAP HANA Cloud service

=== "External"

    !!! caution "<!--###--> To earn your badge for the whole mission, you will need to mark all steps in a tutorial as done, including any optional ones that you may have skipped because they are not relevant for you."

SAP HANA Cloud service instances are not created automatically for any type of account. Therefore, you will have to create an SAP HANA Cloud service instance first, if you don't have one yet.

If you already have an SAP HANA Cloud service instance in your Cloud Foundry space &rarr; continue with **Use an Existing SAP HANA Cloud service instance**.

If you need to create an SAP HANA Cloud service instance first &rarr; continue with **Create an SAP HANA Cloud service instance**.

!!! note "Additional Documentation:"
      - [SAP HANA Cloud Getting Started Guide](https://help.sap.com/viewer/db19c7071e5f4101837e23f06e576495/cloud/en-US/d0aa0ec935c1401e8deb3be35d49730b.html)
      - [SAP HANA Cloud Administrator DBADMIN](https://help.sap.com/viewer/f9c5015e72e04fffa14d7d4f7267d897/cloud/en-US/5b35402c47b344d882ac13c661aff1c0.html)

## (Optional) Create an SAP HANA Cloud service instance

!!! note "Follow this step only when you don't have an instance, if you do then continue with **Use an Existing SAP HANA Cloud service instance**"

1. Go to your SAP BTP cockpit by using one of the following links, depending on the landscape you want to use.

    === "Trial"
        [https://cockpit.hanatrial.ondemand.com/](https://cockpit.hanatrial.ondemand.com/)

    === "Canary"
        [https://account.int.sap.eu2.hana.ondemand.com/](https://account.int.sap.eu2.hana.ondemand.com/)

    === "Live"
        [https://account.hana.ondemand.com/](https://account.hana.ondemand.com/)

2. Enter your **Global Account**.

3. Choose **Account Explorer** in the left-hand pane.

4. In the **Subaccounts** tab, choose the subaccount to which you want to deploy your service and application.

    ![Choose Subaccount](markdown/images/choose_subaccount.png)

5. Choose **Cloud Foundry** &rarr; **Spaces** in the left-hand pane.

6. Choose the **Space** that you want to deploy to.

    ![SAP HANA Cloud](markdown/images/hana_cloud_spaces.png)

7. Choose **SAP HANA Cloud** in the left-hand pane.

    ![SAP HANA Cloud](markdown/images/hana_cloud_empty.png)

8. Choose **Create** &rarr; **SAP HANA database**.

9. Sign in with your SAP BTP cockpit username/e-mail.

10. Choose **SAP HANA Cloud, SAP HANA Database** and choose **Next Step**.

    ![Create SAP HANA Cloud: Step 1](markdown/images/hana_cloud_create_1.png)

11. The **Organization** and **Space** will be selected. Enter the **Instance Name** `cpapp`.

    ![Create SAP HANA Cloud: Step 2a](markdown/images/hana_cloud_create_2a.png)

12. Enter a password for _DBADMIN_ in **Administrator Password** and **Confirm Administrator Password**.

    ![Create SAP HANA Cloud: Step 2b](markdown/images/hana_cloud_create_2b.png)

13. Choose **Next Step**. The default settings should be sufficient for the tutorial application.

    ![Create SAP HANA Cloud: Step 3](markdown/images/hana_cloud_create_3.png)

14. Choose **Next Step**.

15. At **SAP HANA Database Availability Zone and Replicas**, choose again **Next Step**.

16. Choose `Allow All IP addresses`, choose again **Next Step**.

    ![Create SAP HANA Cloud: Step 4](markdown/images/hana_cloud_create_4.png)

    !!! caution "Do not use this setting for productive use, we use it here for convenience but in production you should find a secure alternative like explicitly configuring the allowed IP addresses."

    === "SAP"
        While `Allow only BTP IP addresses` should be chosen for productive use, local access can be helpful for development scenarios. Therefore, you can add the CIDR codes for your SAP offices. See section [Public Office Network IP Addresses](https://nip.wdf.sap.corp/nip2/faces/networking/wan/PublicAddresses.xhtml) for more details.

        ![Create SAP HANA Cloud: Step 5](markdown/images/hana_cloud_create_5.png)

    !!! caution "Do not create a Data Lake. It's useful for ingesting, storing, and analyzing high volumes of data but you don't need it for the tutorial application."

    === "SAP"
        The Data Lake creation step is available only on SAP BTP Trial. Hence, you can skip this step if you are using a different landscape.

17. Choose **Review and Create** to review your HANA Cloud instance configuration and choose **Create Instance**.

    !!! info "You can also copy the configuration so you can create a similar instance or cancel the creation and start from the beginning."

    The creation of the database instance can take some minutes to complete. The final result looks like this in SAP BTP cockpit:

    ![SAP HANA Cloud Instance Created](markdown/images/hana_cloud_created.png)

    !!! note "If you are following this tutorial for Kyma, then follow the steps in this note. Please ignore this note when you are only working on the Cloud Foundry mission."

        13. Choose "Kyma" as the environment type.
        14. Find your Kyma cluster ID as described next.
        15. Navigate to the Kyma dashboard, choose, Namespaces then choose kyma-system, Choose Secrets in the sidebar, choose Decode finally copy your cluster ID from here.
        16. Add your cluser ID in SAP HANA Cloud mapping section.
        17. Enter the Namespace which is the same as you created in Kyma dashboard.

    !!! caution "Your SAP HANA Cloud service instance will be automatically stopped overnight, according to the server region time zone. That means you need to restart your instance every day before you start working with it."
        You can either use SAP BTP cockpit or the Cloud Foundry CLI to restart the stopped instance:
        ```bash
        cf update-service cpapp -c '{"data":{"serviceStopped":false}}'
        ```

## (Optional) Use an existing SAP HANA Cloud service instance

!!! note "Follow this step only if you have an instance created already, if you don't then continue with **Create an SAP HANA Cloud service instance**"

1. Go to your SAP BTP cockpit by using one of the following links, depending on the landscape you want to use.

    === "Trial"
        [https://cockpit.hanatrial.ondemand.com/](https://cockpit.hanatrial.ondemand.com/)

    === "Canary"
        [https://account.int.sap.eu2.hana.ondemand.com/](https://account.int.sap.eu2.hana.ondemand.com/)

    === "Live"
        [https://account.hana.ondemand.com/](https://account.hana.ondemand.com/)

2. Enter your **Global Account**.

3. Choose **Account Explorer** in the left-hand pane.

4. In the **Subaccounts** tab, choose the subaccount to which you want to deploy your service and application.

    ![Choose Subaccount](markdown/images/choose_subaccount.png)

5. Choose **Cloud Foundry** &rarr; **Spaces** in the left-hand pane.

6. Choose the space where you already have the SAP HANA Cloud service instance.

7. Choose **SAP HANA Cloud** in the left-hand pane.

8. Choose **Manage SAP HANA Cloud** in the upper right corner.

9. Sign in with your SAP BTP Cockpit username and email.

    The **SAP HANA Cloud Central** cockpit opens.

10. Choose an organization and again choose the space where you have the SAP HANA Cloud service instance.

    ![SAP HANA Cloud cockpit](markdown/images/hana_cloud_cockpit.png)

11. Choose your service instance.

12. Choose **Create Mapping**.


!!! note "If you are following this tutorial for Kyma, then follow the steps in this note. Please ignore this note when you are only working on the Cloud Foundry mission."

    13. Choose "Kyma" as the environment type.
    14. Find your Kyma cluster ID as described next.
    15. Navigate to the Kyma dashboard, choose, Namespaces then choose kyma-system, Choose Secrets in the sidebar, choose Decode finally copy your cluster ID from here.
    16. Add your cluser ID in SAP HANA Cloud mapping section.
    17. Enter the Namespace which is the same as you created in Kyma dashboard.

13. Choose the **Org ID** and **Space ID** where you want to deploy the application.

14. Choose **Add**.


<!-- [VALIDATE_1] -->