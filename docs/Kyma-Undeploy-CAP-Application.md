---
author_name: Mahati Shankar
author_profile: https://github.com/smahati
title: Undeploy Your CAP Application from Kyma
description: This tutorial shows you how to undeploy your CAP application from Kyma.
keywords: cap
auto_validation: true
time: 5
tags: [ tutorial>beginner, software-product-function>sap-cloud-application-programming-model, programming-tool>node-js, software-product>sap-business-technology-platform, software-product>sap-btp\\, kyma-runtime, software-product>sap-fiori]
primary_tag: software-product-function>sap-cloud-application-programming-model
---

## Prerequisites
 - [Assign a Role Collection to a User](../Kyma-Role-Assignment)


## Details
### You will learn
 - How to undeploy your CAP application from Kyma

---

## Undeploy your CAP application from Kyma

1. Uninstall the CAP application:

    ```bash
    helm uninstall cpapp
    ```

2. Delete the database secret:

    ```bash
    kubectl delete secret cpapp-db
    ```

3. Delete the container registry secret:

    ```bash
    kubectl delete secret container-registry
    ```

4. Delete the namespace:

    ```bash
    kubectl delete namespace  risk-management
    ```

<!-- [VALIDATE_1] -->