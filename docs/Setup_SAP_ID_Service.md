# Setup SAP ID Service Tenant

!!! warning "UNDER CONSTRUCTION"

## Create SAP ID Service Tenant

* [Create Internal Tenants](https://tenants.ias.only.sap/#/requests/NEW_INTERNAL)
* [Create Customer Tenants](https://tenants.ias.only.sap/#/requests/NEW_CUSTOMER)

## Setup Trust

Bi-directional trust needs to be established to setup the application login from the SAP ID Service Tenant:

```mermaid
graph LR
    A[SAP CP Subaccount] -- trust --> B[SAP ID Service Tenant]
```

```mermaid
graph LR
    A[SAP ID Service Tenant] -- trust --> B[SAP CP Subaccount]
```

Proceed like described here: [How to Establish Trust between an XSUAA tenant and an SAML 2.0 Identity Provider Using SAP Cloud Platform Identity Authentication Service
 (Jam)](https://jam4.sapjam.com/blogs/show/Cv8nraCxXJAyBA1ichYa1F?_lightbox=true)


## (Optional) Create Technical Admin User For System Management

This technical user can be used to automate management of your SAP ID Service Tenant.

1. Goto your SAP ID Service Tenant
1. Goto User Authorizations > Administrators > System Admin
1. Add System
1. Name: SystemAdmin
1. Set Password and store it in your [SAP PassVault](SAP_PassVault.md)

## (Optional) Enable User Self-Registration

This allows user to register themself to your application.

1. Goto your SAP ID Service Tenant
1. Applications & Resources > Applications
1. Choose your application
1. Authentication & Access > User Application Process
1. Select Public
