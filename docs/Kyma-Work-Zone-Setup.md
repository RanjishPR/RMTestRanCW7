---
author_name: Mahati Shankar
author_profile: https://github.com/smahati
title: Prepare SAP Build Work Zone, Standard Edition Setup for Kyma
description: Learn how to prepare your UI applications, add deployment configuration for HTML5 applications to your project, and configure your Helm chart for HTML5 application deployment.
keywords: cap
auto_validation: true
time: 35
tags: [ tutorial>beginner, software-product-function>sap-cloud-application-programming-model, programming-tool>node-js, software-product>sap-business-technology-platform, software-product>sap-btp\\, kyma-runtime, software-product>sap-fiori]
primary_tag: software-product-function>sap-cloud-application-programming-model
---

## Prerequisites
 - [Deploy Your CAP Application to Kyma](../Kyma-Deploy-Application)

## Details
### You will learn
 - How to add navigation targets and prepare your UI applications
 - How to build and push the docker image for HTML5 application deployer
 - How to configure your Helm chart for HTML5 application deployment

---

## Prepare UI Applications

In this tutorial, you will use the SAP Build Work Zone, standard edition to access your CAP service and its UI. Additionally, the SAP Build Work Zone, standard edition provides features like personalization, role-based visibility, theming, and more. You can add multiple applications to one launchpad, including subscribed ones and applications from SAP S/4HANA or SAP BTP.

Navigation targets are required to navigate between applications, but also to start the applications from SAP Build Work Zone, standard edition. In the next steps, you add the navigation targets `Risks-display` and `Mitigations-display` to the application manifest (`manifest.json`) file.

## Add navigation target for Risks UI

1. Open the file `app/risks/webapp/manifest.json`.

2. Add the external navigation target to the `sap.app` JSON object. You can add it right behind the `sourceTemplate` object:

<!-- cpes-file app/risks/webapp/manifest.json:$["sap.app"].crossNavigation -->
```json hl_lines="8-19"
{
  ...
  "sap.app": {
    "id": "ns.risks",
    ...
    "sourceTemplate": {
      ...
    },
    "crossNavigation": {
      "inbounds": {
        "Risks-display": {
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

## Add navigation target for Mitigations UI

1. Open the file `app/mitigations/webapp/manifest.json`.

2. Add the external navigation target to the `sap.app` JSON object, but this time with `semanticObject` name `Mitigations`. You can add it right after the `dataSources` object:

<!-- cpes-file app/mitigations/webapp/manifest.json:$["sap.app"].crossNavigation -->
```json hl_lines="8-19"
{
  ...
  "sap.app": {
    "id": "ns.mitigations",
    ...
    "dataSources": {
      ...
    },
    "crossNavigation": {
      "inbounds": {
        "Mitigations-display": {
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

## Install required UI tools


1. Install the [SAPUI5 tooling](https://www.npmjs.com/package/@sap/ux-ui5-tooling) package as a global module in the root folder of your project:

    ```bash
    npm install --global @sap/ux-ui5-tooling
    ```

2. Install the [SAP Fiori application generator](https://www.npmjs.com/package/@sap/generator-fiori) package as a global module:

    ```bash
    npm install --global @sap/generator-fiori
    ```

## Add CAP deployment descriptor

Since you're working with a CAP application, there must be an `mta.yaml` deployment descriptor file in your project directory. This file is used during Cloud Foundry deployments to determine what Cloud Foundry apps and service instances should be created. In the context of deploying to Kyma, however, the `mta.yaml` file will not be used for deployment. Instead, it will only be used by the SAP Fiori generator to add the deployment configurations for the SAP Fiori applications `Risks` and `Mitigations`. To create the deployment descriptor, run the following command in your project root folder:

```bash
cds add mta
```

## Add deployment configuration for the SAP Fiori elements Risks application

1. Switch to `app/risks` folder:

    ```bash
    cd app/risks
    ```

2. Run npm install

2. Add deployment configuration:

    ```bash
    fiori add deploy-config cf
    ```

    !!! caution "If the SAP Fiori generator fails, make sure to remove other `.yo-rc.json` files you might have in any of your project's directories and try again."

3. Enter the following settings:

    - ```Destination name ()```: **`cpapp-srv`**
    - ```Editing the deployment configuration will overwrite existing configuration, are you sure you want to continue? (Y/n)```: **`y`**

!!! caution "On Windows, you might get an error when executing this command."
    The CDS development kit that we use in this tutorial series includes a batch executable file. Since it's not a binary, executing it on Windows might return an error similar to this one:

    ```bash
    Error @sap/fiori:deploy-config cf --base ui5.yaml --config ui5-deploy.yaml
    spawnSync cds ENOENT
    ```

    The issues is currently being fixed but here a workaround you can use for the time being:

    1. Open the file `C:\Users\<Your-User>\AppData\Roaming\npm\node_modules\@sap\generator-fiori\generators\deployment-generator\cf\index.js`.
    2. Search for `cwd:this.destinationPath()`.
    3. Add `, shell:true` after `cwd:this.destinationPath()` within the curly brackets.
    4. Save and close the file.
    5. The `fiori add deploy-config cf` command should run without errors now.

## Add deployment configuration for the SAPUI5 freestyle Mitigations application

1. Switch to the `app/mitigations` folder:

    ```bash
    cd ../../app/mitigations/
    ```

2. Add the deployment configuration:

    ```bash
    fiori add deploy-config cf
    ```

3. Enter the following settings:

    - ```Destination name ()```: **`cpapp-srv`**
    - ```Editing the deployment configuration will overwrite existing configuration, are you sure you want to continue? (Y/n)```: **`y`**


## Adjust data source path to avoid errors

Make sure that the value of the `uri` parameter of the `mainService` object in both `app/risks/webapp/manifest.json` and `app/mitigations/webapp/manifest.json` does not start with a forward slash (`/`):

```json hl_lines="8"
{
	"_version": "1.32.0",

	"sap.app": {
		...
		"dataSources": {
			"mainService": {
				"uri": "service/risk/",
				"type": "OData",
					"settings": {
					"odataVersion": "4.0",
					"localUri": "localService/metadata.xml"
				}
			}
		},
  }
  ...
}
```

This will ensure you don't get any errors when trying to access the **Risks** or **Mitigations** apps later through the SAP Build Work Zone, standard edition.

## Add SAP Cloud service

Add your SAP Cloud service at the end of `app/risks/webapp/manifest.json` and `app/mitigations/webapp/manifest.json` files:

<!-- cpes-file app/risks/webapp/manifest.json:$["sap.cloud"] -->
```json hl_lines="6-9"
{
  "_version": "",
  ...
  "sap.fiori": {
    ...
  },
  "sap.cloud": {
    "public": true,
    "service": "cpapp.service"
  }
}
```

The name of your SAP Cloud service (`cpapp` in this case) should be unique within an SAP BTP region. It is used to identify the resources that belong to one UI in the SAP Build Work Zone, standard edition.

## Create package.json and build script for app deployer

1. Create a file `app/package.json` for the HTML5 application deployer application and add the following code to it:

    ```json
    {
        "name": "html5-deployer",
        "scripts": {
            "start": "node node_modules/@sap/html5-app-deployer/index.js"
        },
        "workspaces": [
            "risks",
            "mitigations"
        ]
    }
    ```

    The `build` script triggers the build of the Fiori applications for deployment in the HTML5 application repository. The two UI applications are referred as sub packages ("workspaces") which is required for the build.

    The deployer is run with the `start` script.

2. Add a file `app/build.sh` for the Fiori application build and add the following code to it:

    ```sh
    #!/bin/bash

    set -e

    npm run build:cf --prefix app/risks
    npm run build:cf --prefix app/mitigations

    rm -rf gen/ui
    mkdir -p gen/ui/resources

    mv app/risks/dist/nsrisks.zip gen/ui/resources
    mv app/mitigations/dist/nsmitigations.zip gen/ui/resources
    cp app/launchpage.html gen/ui/
    cp app/package.json gen/ui
    ```

    This script calls the UI5 build for the two SAP Fiori applications and copies the result into the `resources` directory.


3. Navigate back to your project root folder:

    ```bash
    cd ../..
    ```

4. Add the HTML5 application deployer package `@sap/html5-app-deployer` to the `app/package.json` file:

    ```bash
    npm install --prefix app @sap/html5-app-deployer
    ```

5. Delete `node_modules` and `package-lock.json` files within `app` folder and its subfolders.

    When switching to the `npm` workspace feature old `package-lock.json` and `node_modules` cause problems. Therefore, execute the following command:

    ```bash
    rm -rf {app,app/risks,app/mitigations}/{node_modules,package-lock.json}
    ```

## Build HTML5 application deployer image

1. Set container registry environment variable:

    ```bash
    CONTAINER_REGISTRY=<your-container-registry>
    ```

    !!! info "Looking for `<your-container-registry>`?"
        Value for `<your-container-registry>` is the same as the docker server URL and the path used for docker login. You can quickly check it by running the following command in your terminal:

        ```json
        cat ~/.docker/config.json
        ```

2. Run the build script:

    ```bash
    bash app/build.sh
    ```
2. Build docker image:

    ```bash
    pack build $CONTAINER_REGISTRY/cpapp-html5-deployer \
          --env BP_NODE_RUN_SCRIPTS="" \
          --path gen/ui \
          --buildpack gcr.io/paketo-buildpacks/nodejs \
          --builder paketobuildpacks/builder:base
    ```

    The parameter `--env BP_NODE_RUN_SCRIPTS=build` triggers the build script in the `app/package.json`, which runs the UI5 build for the SAP Fiori applications as it is defined in the `app/build.sh` file. The build result appears in the docker image only. It's not on your file system.

3. Push docker image:

    ```bash
    docker push $CONTAINER_REGISTRY/cpapp-html5-deployer
    ```

## Configure Helm chart for HTML5 application deployment

1. Add the HTML5 Application Deployer to your Helm chart:

    ```bash
    cds add html5-repo
    ```

    This adds three new sections `html5-apps-deployer` and `html5_apps_repo_host`  and `destinations` to the `chart/values.yaml` file and also copies a few additional files in the `chart/templates` folder. It deploys your HTML5 applications using the `cpapp-html5-deployer` image and creates the required destinations to access the CAP service. The `HTML5Runtime_enabled` option makes the destinations accessible for the SAP Build Work Zone, standard edition.

2. Replace `<your-container-registry>` with your container registry URL in the `html5-apps-deployer` section of your `chart/values.yaml` file:

    ```yaml hl_lines="5"
    html5-apps-deployer:
      cloudService: null
      backendDestinations: {}
      image:
        repository: <your-container-registry>/cpapp-html5-deployer
        tag: latest
    ```

3.  Add the destination and the cloud service to your backend service:

    ```yaml hl_lines="3 8-9"
    html5-apps-deployer:
      env:
        SAP_CLOUD_SERVICE: cpapp.service
      envFrom:
        ...
    ...
    backendDestinations:
      cpapp-srv:
        service: srv
    ```

     The `backendDestinations` configuration creates a destination with the name `cpapp-srv` that points to the URL for your CAP service `srv`.
     With this step we're reflecting in the `values.yaml` file the configurations you already did for:

     - Destination `cpapp-srv` for the Risks application, done in `Step 5: Add deployment configuration for the SAP Fiori elements Risks application`.
     - Destination `cpapp-srv` for the Mitigations application, done in `Step 6: Add deployment configuration for the SAPUI5 freestyle Mitigations application`.
     - Cloud service for both applications, done  `Step 7: Add Cloud Service`.


## Re-deploy your application

Run the deploy command again:

```bash
helm upgrade cpapp ./chart --install --set-file xsuaa.jsonParameters=xs-security.json
```


<!-- [VALIDATE_1] -->
