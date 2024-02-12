---
author_name: Mahati Shankar
author_profile: https://github.com/smahati
title: Assign a Role Collection to a User
description: This tutorial shows you how to assign roles to users.
keywords: cap
auto_validation: true
time: 5
tags: [ tutorial>beginner, software-product-function>sap-cloud-application-programming-model, programming-tool>node-js, software-product>sap-business-technology-platform, software-product>sap-btp\\, kyma-runtime, software-product>sap-fiori]
primary_tag: software-product-function>sap-cloud-application-programming-model
---

## Prerequisites
 - [Subscribe to the SAP Build Work Zone, Standard Edition](../Kyma-Work-Zone-Subscribe)

## Details
### You will learn
 - How to assign roles to users

---

## Assign roles

To be able to access the application, your user needs to be assigned to a role collection that provides the required scopes.

1. Open **SAP BTP Cockpit**.

2. Go to the **Subaccount** where you have deployed your service and application.

3. Choose **Security** &rarr; **Role Collections** on the left.

4. Select `RiskManager` in the list of role collections.

5. Choose **Edit**.

6. Enter the **E-Mail Address** of your user.

7. Choose **Save**.

Your user now appears in the list of the role collection's users.

<!-- [VALIDATE_1] -->

{! includes/Create-Role-Collection-Manually.md!}