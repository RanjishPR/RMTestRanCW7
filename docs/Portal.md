# Add the SAP BTP Portal Service

In this tutorial, you will replace the Launchpage with the SAP BTP Portal. This will provide features like personalization and UI flexibility, role-based visibility, and more for your application.

It is also a step towards the use of your application in the customer's cFLP.

??? note "Additional Documentation"

    - [Content Deployment](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/d3e23196166b443db17b3545c912dfc0.html)


## Preparations

Make sure that your subaccount has quota for the services `Portal` and `HTML5 Applications` as described in [Prepare SAP BTP and Cloud Foundry](Prepare-BTP.md).

## Overview

The main changes in this tutorial are:

* Deploy the SAP Fiori Elements app to HTML5 Repository instead pushing it to the AppRouter.
* Create and deploy the configuration for the Portal.
* Bind the AppRouter to HTML5 Repository and Portal Service.
* Access the application through the Portal.

## Required Services

Add the following services to the `resources` section of the `mta.yaml` file:

<!-- cpes-file mta.yaml:$.resources[?(@.name=="cpapp-portal")] -->
```yaml hl_lines="3-9"
_schema-version: '3.1'
...
resources:
  ...
  - name: cpapp-portal
    type: org.cloudfoundry.managed-service
    parameters:
      service-plan: standard
      service: portal
```

<!-- cpes-file mta.yaml:$.resources[?(@.name=="cpapp-html5-repo-runtime")] -->
```yaml hl_lines="3-9"
_schema-version: '3.1'
...
resources:
  ...
  - name: cpapp-html5-repo-runtime
    type: org.cloudfoundry.managed-service
    parameters:
      service-plan: app-runtime
      service: html5-apps-repo
```

<!-- cpes-file mta.yaml:$.resources[?(@.name=="cpapp-html5-repo-host")] -->
```yaml hl_lines="3-9"
_schema-version: '3.1'
...
resources:
  ...
  - name: cpapp-html5-repo-host
    type: org.cloudfoundry.managed-service
    parameters:
      service-plan: app-host
      service: html5-apps-repo
```

* The `portal` service is required to deploy the portal content and access the Portal via the AppRouter.
* The `html5-apps-repo` service with plan `app-runtime` is required to access the HTML5 applications (SAP Fiori Element applications in this case) via AppRouter.
* The `html5-apps-repo` service with plan `app-host` is required to deploy the HTML5 applications to the HTML5 Application Repository.

## Portal Content

Copy the folder `portal-content` from `templates/portal/service` into your project folder.

The file `portal-content/portal-site/CommonDataModel.json` contains the configuration of the portal site.

It defines one group `defaultGroupId` containing both your **Risks** and **Mitigations** applications.

The `appId` is the id of the to be launched application and need to match the `id` from the `manifest.json` of the application. The `vizId` is the navigation intent, that must be present `inbound` `crossNavigation` target of the application. Here, the semantic objects `Risks` and `Mitigations` are added with the action `display`. They need to be defined in the applications' `manifest.json` files.

<!-- cpes-file portal-content/portal-site/CommonDataModel.json:$.payload.groups -->
```json
{
  "_version": "3.0.0",
  ...
  "payload": {
    "catalogs": "...",
    "groups": [
      {
        "_version": "3.0.0",
        "identification": {
          "id": "defaultGroupId",
          "title": "{{title}}",
          "entityType": "group",
          "i18n": "i18n/defaultGroupId.properties"
        },
        "payload": {
          "viz": [
            {
              "id": "ns.risks.display",
              "appId": "ns.risks",
              "vizId": "Risks-display"
            },
            {
              "id": "ns.mitigations.display",
              "appId": "ns.mitigations",
              "vizId": "Mitigations-display"
            }
          ]
        }
      }
    ]
  }
}
```

## Application Manifest

In this step, you add the intents `Risks-display` and `Mitigations-display` to the Application Manifest (`manifest.json`) files.

### Add `Risks-display`

Open the file `app/risks/webapp/manifest.json`.

Add the external navigation target to the `sap.app` JSON object. You can add it right behind the `sourceTemplate` object:

<!-- cpes-file app/risks/webapp/manifest.json:$["sap.app"].crossNavigation -->
```json hl_lines="6-17"
{
  "_version": "1.15.0",
  "sap.app": {
    "id": "ns.risks",
    ...
    "crossNavigation": {
      "inbounds": {
        "intent1": {
          "signature": {
            "parameters": {},
            "additionalParameters": "allowed"
          },
          "semanticObject": "Risks",
          "action": "display"
        }
      }
    }
  }
}
```
### Add `Mitigations-display`

Do the same with the mitigations manifest file `app/mitigations/webapp/manifest.json`, but with the `semanticObject` name `Mitigations`:

<!-- cpes-file app/mitigations/webapp/manifest.json:$["sap.app"].crossNavigation -->
```json hl_lines="6-17"
{
  "_version": "1.12.0",
  "sap.app": {
    "id": "ns.mitigations",
    ...
    "crossNavigation": {
      "inbounds": {
        "intent1": {
          "signature": {
            "parameters": {},
            "additionalParameters": "allowed"
          },
          "semanticObject": "Mitigations",
          "action": "display"
        }
      }
    }
  }
}
```

### Set `minUI5Version` (Required for Use with the Portal)

There is a small glitch that you need to fix. Otherwise, the portal deployment will fail.

Search for `minUI5Version` in both `manifest.json` files and give it an SAP UI5 version as value as shown here:

<!-- cpes-file app/risks/webapp/manifest.json:$["sap.ui5"].dependencies -->
```json hl_lines="7-7"
{
  "_version": "1.15.0",
  ...
  "sap.ui5": {
    "resources": "...",
    "dependencies": {
      "minUI5Version": "1.75.0",
      "libs": {
        "sap.fe.templates": {},
        "sap.ui.fl": {}
      }
    }
  }
}
```

## HTML5 Application Repository Deployment

The Portal requires the UIs to be deployed to the HTML5 Application Repository in order to find it.

Therefore, the UIs will be deployed to this repository and will no longer be part of the AppRouter deployment.

Delete the module `cpapp-app` from the `mta.yaml` file.

Add the following modules to the `mta.yaml` file:

<!-- cpes-file mta.yaml:$.modules[?(@.name=="cpapp-ui-resources")] -->
```yaml hl_lines="3-21"
_schema-version: '3.1'
...
modules:
  ...
  - name: cpapp-ui-resources
    type: com.sap.application.content
    path: gen/ui-resources
    requires:
      - name: cpapp-html5-repo-host
        parameters:
          content-target: true
    build-parameters:
      requires:
        - name: cpapp-risks
          artifacts:
            - ./*.zip
          target-path: .
        - name: cpapp-mitigations
          artifacts:
            - ./*.zip
          target-path: .
```

<!-- cpes-file mta.yaml:$.modules[?(@.name=="cpapp-risks")] -->
```yaml hl_lines="3-14"
_schema-version: '3.1'
...
modules:
  - name: cpapp-risks
    type: html5
    path: app/risks
    build-parameters:
      builder: custom
      commands:
        - npm install
        - npx ui5 build --dest ../../gen/app/risks/dist --include-task=generateManifestBundle --include-task=generateCachebusterInfo
        - bash -c "cd ../../gen/app/risks/dist && npx bestzip ../risks.zip *"
      supported-platforms: []
      build-result: ../../gen/app/risks
```

<!-- cpes-file mta.yaml:$.modules[?(@.name=="cpapp-mitigations")] -->
```yaml hl_lines="3-15"
_schema-version: '3.1'
...
modules:
  ...
  - name: cpapp-mitigations
    type: html5
    path: app/mitigations
    build-parameters:
      builder: custom
      commands:
        - npm install
        - npx ui5 build --dest ../../gen/app/mitigations/dist --include-task=generateManifestBundle --include-task=generateCachebusterInfo
        - bash -c "cd ../../gen/app/mitigations/dist && npx bestzip ../mitigations.zip *"
      supported-platforms: []
      build-result: ../../gen/app/mitigations
```

The modules `cpapp-risks` and `cpapp-mitigations` do the UI5 build. The build result contains a ZIP file containing optimized UI resources and a ZIP file `manifest-bundle.zip` with the `manifest.json` and the `i18n` files. The later is required by the Portal.

The module `cpapp-ui-resources` is not a Cloud Foundry application. The MTA deployer will push its content, the ZIP files from the `cpapp-risks` and `cpapp-mitigations` build, to the HTML5 Application Repository.

## Add `xs-app.json` for the HTML5 Applications

To upload an UI application to the HTML5 Application Repository, it needs a `xs-app.json` file. The file tells the AppRouter how to serve the application. In this simple case, it just needs to route all requests to its uploaded content. This is specified by routing all requests for this UI application to the HTML5 application runtime service (service instance `html5-apps-repo-rt`) that will return the uploaded content for the same UI application.

Create a file `app/risks/webapp/xs-app.json` and `app/mitigations/webapp/xs-app.json` with the following same content:

<!-- cpes-file app/risks/webapp/xs-app.json -->
```json
{
  "authenticationMethod": "route",
  "logout": {
    "logoutEndpoint": "/do/logout"
  },
  "routes": [
    {
      "source": "^(.*)$",
      "target": "$1",
      "service": "html5-apps-repo-rt",
      "authenticationType": "xsuaa"
    }
  ]
}
```

## Portal Content Deployment

Add another module to the `mta.yaml` file to deploy the portal content to the Portal Service. This will as well deploy the content only and does not push an application.

<!-- cpes-file mta.yaml:$.modules[?(@.name=="cpapp-portal-content-deployer")] -->
```yaml hl_lines="3-18"
_schema-version: '3.1'
...
modules:
  ...
  - name: cpapp-portal-content-deployer
    type: com.sap.application.content
    path: portal-content
    requires:
      - name: cpapp-portal
        parameters:
          content-target: true
          service-key:
            name: cpapp-portal-deploy-key
            config:
              content-endpoint: developer
      - name: cpapp-uaa
      - name: cpapp-html5-repo-host
      - name: cpapp-ui-resources
```

## AppRouter

### Remove UIs from AppRouter

Remove the UI applications from the AppRouter. They are deployed in the HTML5 application repository and no longer needed here.

Delete the following highlighted lines from the `cpapp-approuter` module in the `mta.yaml`:

```yaml hl_lines="6-11"
...
modules:
  ...
  - name: cpapp-approuter
    ...
    build-parameters:
      requires:
        - name: cpapp-app
          artifacts:
            - ./*
          target-path: resources
```

### Add Service Bindings for HTML5 Application Runtime and Portal Service

Add the required service bindings to the HTML5 Application Runtime `html5-apps-repo` and the Portal Service `portal` to the `cpapp-approuter` module in the `mta.yaml` file:

<!-- cpes-file mta.yaml:$.modules[?(@.name=="cpapp-approuter")] -->
```yaml hl_lines="11-12"
_schema-version: '3.1'
...
modules:
  ...
  - name: cpapp-approuter
    type: nodejs
    path: approuter
    requires:
      - name: cpapp-uaa
      - name: cpapp-logs
      - name: cpapp-portal
      - name: cpapp-html5-repo-runtime
      - name: srv-api
        group: destinations
        properties:
          forwardAuthToken: true
          strictSSL: true
          name: srv-api
          url: '~{srv-url}'
```

### Change AppRouter Configuration

Do the following changes to the `approuter/xs-app.json` file:

1. Change the value of the `welcomeFile` property to `/cp.portal` to start the portal.
2. Remove the route to the `resources` directory, because the UI will be loaded from the HTML5 Application Repository and are not shipped in the AppRouter any longer.

<!-- cpes-file approuter/xs-app.json -->
```json hl_lines="2-2"
{
    "welcomeFile": "/cp.portal",
    "authenticationMethod": "route",
    "sessionTimeout": 30,
    "logout": {
        "logoutEndpoint": "/do/logout",
        "logoutPage": "/"
    },
    "routes": [
        {
            "source": "^/service/(.*)$",
            "destination": "srv-api",
            "authenticationType": "xsuaa"
        }
     ]
}
```

You should also `remove` the resources from the `approuter` directory.

Run:
```bash
rm -rf approuter/resources
```

Add the following custom build options in the `mta.yml` file:

<!-- cpes-file mta.yaml:$.build-parameters -->
```yaml hl_lines="7 12"
_schema-version: '3.1'
...
build-parameters:
  before-all:
   - builder: custom
     commands:
      - rm -rf cpapp-ui-deployer/resources
      - npm install --production
      - bash -c "cds -v 2>/dev/null >/dev/null || npm install --no-save @sap/cds-dk"
      - npx cds build --production
      - bash -c 'find gen -type f \( -name '*.csv' -or -name '*.hdbtabledata' \) | xargs rm -f'
      - mkdir gen/ui-resources
```

## Enable XSUAA for Token Exchange

The portal service needs to know the users identity, therefore it expects a OAuth2 JWT token with the user id. But the JWT token that is created in the login process initiated by the AppRouter isn't accepted by the portal because the portal uses a different XSUAA instance. The AppRouter needs to create a new JWT token for the Portal using the "token exchange" mechanism. This requires the `uaa.user` scope to be present in the JWT token after the login. Therefore, the `xs-security.json` file needs to be extended by another role that adds the token. The role doesn't need to be added to the user. The presence of its in `xs-security.json` is sufficient.

Add the following `role-template` to the `xs-security.json` file:

<!-- cpes-file xs-security.json:$["role-templates"] -->
```json hl_lines="20-26"
{
  "xsappname": "cpapp",
  ...
  "role-templates": [
    {
      "name": "RiskViewer",
      "description": "generated",
      "scope-references": [
        "$XSAPPNAME.RiskViewer"
      ],
      "attribute-references": []
    },
    {
      "name": "RiskManager",
      "description": "generated",
      "scope-references": [
        "$XSAPPNAME.RiskManager"
      ],
      "attribute-references": []
    },
    {
      "name": "Token_Exchange",
      "description": "UAA",
      "scope-references": [
        "uaa.user"
      ]
    }
  ]
}
```

## Test It

Build your app and deploy it to Cloud Foundry.

If you use the `mta.yaml` file, run:

```bash
mbt build -t ./
cf deploy cpapp_1.0.0.mtar
```

Open the URL in the browser and log in with your SAP user name & password.

You can find out the URL of your app using:
```bash
cf apps
```
