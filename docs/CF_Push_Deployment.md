# Deploy Your Application Using `cf push`

<!-- currently not used, please do not change

This has been removed to use only the MTA deployment for CF, is changed for Launchpad Service. Probably, we want to
revive this later.

Reported issues (might be partially solved already): https://github.tools.sap/CPES/CPAppDevelopment/issues/3

-->

??? info "Prerequisites"
	- [Prepare SAP BTP](../Prepare_BTP)
	- [Roles and Authorization Checks](../Roles_CAP)

??? note "Additional Documentation"
	- [Official CAP documentation](https://cap.cloud.sap/docs/advanced/deploy-to-cloud#cfpush)
	- [Deploy a CAP Business Application to SAP BTP](https://developers.sap.com/tutorials/cap-service-deploy.html)



This module is an alternative to the [Deploy Your Application Using MultiApps (MTA)](../MTA_Deployment) module. If you are more interested in successfully completing the tutorial than how it works with `cf push` specifically, then you can skip this module and continue with [Deploy Your Application Using MultiApps (MTA)](../MTA_Deployment).

!!! caution "The next modules of this tutorial are based on the [Deploy Your Application Using MultiApps (MTA)](../MTA_Deployment) module. You can still use `cf push`, but you will have to translate the changes in the modules back to what they mean for the `cf push` approach."


The instructions below describe the deployment to Cloud Foundry with the built-in `cf push` command using `manifest.yml` files. This is intended for those specifically interested in how this works with "native" cf tools.

??? info "Useful cf links"
    - [```cf push```](https://docs.cloudfoundry.org/devguide/push.html)
    - [Push an App](https://docs.cloudfoundry.org/cf-cli/getting-started.html#push)


## Log on to Cloud Foundry

If you are not logged on to Cloud Foundry from an earlier section or you simply don't know, follow the steps in [Log on to Cloud Foundry](../Prepare_BTP/#log-on-to-cloud-foundry-from-the-command-line).

## Create Services on Cloud Foundry

See [CAP Deployment documentation](https://cap.cloud.sap/docs/advanced/deploy-to-cloud#deploy-using-cf-push).

1. Open a command line window.

1. Create Cloud Foundry manifest files:

    ```bash
    cds add cf-manifest
    ```

    This command creates two files:

    * `manifest.yml` - Manifest of applications to be deployed.
    * `services-manifest.yml` - Manifest of services to be created.

1. Install Cloud Foundry plugin for service manifest push:

    ```bash
    cf install-plugin Create-Service-Push
    ```

    The plugin makes it easier to create and update services. The service information is maintained in file `services-manifest.yml` and can be updated with one call instead of manually calling `cf create-service` and `cf update-service`.

2. Add `xs-security.json` configuration file for XSUAA service to the `services-manifest.yml` file and enable update:

    <!-- cpes-file services-manifest.yml:$["create-services"][?(@.name=="cpapp-uaa")] -->
    ```yaml hl_lines="6-7"
    create-services:
      ...
      - name: cpapp-uaa
        broker: xsuaa
        plan: broker
        parameters: xs-security.json
        updateService: true
    ```

3.  Add role collections to the `xs-security.json` file, which frees you from manually creating them.

    !!! Note "The `xs-security.json` file that was introduced [here](../Prepare_XSUAA/#roles)."

    <!-- cpes-file xs-security.json:$["role-collections"] -->
    ```json hl_lines="6-21"
    {
      "xsappname": "cpapp",
      ...
      "role-templates": [
        "..."
      ],
      "role-collections": [
        {
          "name": "RiskManager",
          "description": "Manage Risks",
          "role-template-references": [
            "$XSAPPNAME.RiskManager"
          ]
        },
        {
          "name": "RiskViewer",
          "description": "View Risks",
          "role-template-references": [
            "$XSAPPNAME.RiskViewer"
          ]
        }
      ]
    }
    ```

4. Create services:

    ```bash
    cf create-service-push --no-push
    ```

    The command will create the services if they don't yet exists and update all services with the `updateService: true` flag, as we've set it for the XSUAA service.

    !!! info "The command without `--no-push` will push the applications as well. However, there's an issue with the newer manifest files."

5. Assign a Role Collections to User by following the steps described in [Assign a Role Collection to User](../BTP_Role_Assignment/) to get your user the permission to access the application.

## Deploy CAP Service to Cloud Foundry

1.  Add services and route to bind the created service instances to your `cpapp-srv` application and define the URL to access the service ("route"), add the following lines to the generated file `manifest.yml`:

    <!-- cpes-file manifest.yml:$.applications[?(@.name=="cpapp-srv")] -->
    ```yaml hl_lines="6-7 11-12"
    applications:
      - name: cpapp-srv
        path: gen/srv
        memory: 256M
        buildpack: nodejs_buildpack
        routes:
          - route: cpapp-srv-((org))-((space)).((domain))
        services:
          - cpapp-db
          - cpapp-uaa
          - cpapp-destination
          - cpapp-connectivity
    ```

    Switch off the dynamic route generation, by removing the line:

    ```yaml
    random-route: true  # for development only
    ```

    The application route is a "full qualified domain name" that needs to be unique. In this example org and space names are used to build the hostname to ensure this constraint.

    Replace `((org))`, `((space))` and `((domain))` with the respective values.

    You can run the command `cf target` to get the values for `((org))` and `((space))`.

    *For example:*

    ```bash hl_lines="4 5"
    api endpoint:   https://api.cf.sap.hana.ondemand.com
    api version:    2.156.0
    user:           your-email@your-mail.com
    org:            your-org
    space:          your-space
    ```

    Use the `cf domains` command to get the list of allowed domains. Just pick the first one.

2.  Build the CDS artifacts for deployment:

    ```bash
    cds build --production
    ```

    This creates a new folder `gen` in your project, it contains everything that needs to be deployed of your data model and service from the `db` and `srv` folders in your project. The `manifest.yml` file already refers to these generated folders.

3. Deploy the application:

    ```
    cf push
    ```

    This will take a while.

    In the deploy log, find the URL for the CAP service in the routes line at the very end:

    ```
    name:              cpapp-srv
    requested state:   started
    routes:            cpapp-srv-***-***.cfapps.eu10.hana.ondemand.com
    ```


## Add the Application Router

You now need to add three additional files to the `app` folder. All of them are needed for the so-called [approuter](https://github.wdf.sap.corp/xs2/approuter.js). The approuter in a nutshell is a component that provides the entry point of all the requests for an application. Whether the requests, in our case, all issued by a browser, are for static UI resources like the SAPUI5 controls, views, and controllers of our Fiori Elements application or requests for our risks service in the CAP backend, all these requests pass through the approuter. As its name implies, it routes all these requests to the different locations, the CAP ones go a different route than the UI ones. In case of the CAP requests, security also comes into play, only users that have the authorizations that we just set up, get access to the service.

1. Add a new file `app/xs-app.json`:

    <!-- cpes-file app/xs-app.json -->
    ```json
    {
        "welcomeFile": "./launchpage.html",
        "logout": {
            "logoutEndpoint": "/do/logout"
        },
        "routes": [
            {
                "source": "^/service/(.*)$",
                "destination": "backend",
                "authenticationType": "xsuaa",
                "cacheControl": "no-cache, no-store, must-revalidate"
            },
            {
                "source": "^/(.*)$",
                "target": "/$1",
                "localDir": ".",
                "authenticationType": "xsuaa"
            }
        ]
    }
    ```

    The configurations in `app/xs-app.json` routes the CAP requests (all of them have `risk` as part of their URL) to a so-called destination `backend`. You can see the routes in the next steps, where this destination is defined. These request all need to be authenticated by the XSUAA. The rest of the requests are all requests for static resources of the UI, they're all passed through as they are, no authorization and routing to a destination is needed.

1. Add a new file `app/package.json`:

    <!-- cpes-file app/package.json -->
    ```json
    {
        "name": "risks-approuter",
        "dependencies": {
            "@sap/approuter": "*"
        },
        "scripts": {
            "start": "node node_modules/@sap/approuter/approuter.js"
        }
    }
    ```

    This is creating an instance of the approuter service on Cloud Foundry and starting it when it's deployed.

41 Add an application `cpapp-app` to the file `manifest.yml`:

    <!-- cpes-file manifest.yml:$.applications[?(@.name=="cpapp-app")] -->
    ```yaml hl_lines="5-18"
    applications:
      ...
      - name: cpapp-db-deployer
        ...
      - name: cpapp-app
        path: app
        memory: 128M
        buildpacks:
          - nodejs_buildpack
        env:
          destinations: |
            [
              {"name":"backend","url":"https://cpapp-srv-((org))-((space)).((domain))","forwardAuthToken":true}
            ]
        routes:
          - route: cpapp-app-((org))-((space)).((domain))
        services:
          - cpapp-uaa
    ```

    This is the creation of our UI application. It has the static UI resources (as we are in the ```app``` folder, the path ```./``` means that everything in this folder is deployed) as well as the approuter. Here the destination ```backend``` that we used in the approuter config from ```xs-app.json``` above is also defined. It routes all the CAP requests to the `capp-srv` app, where the service "lives" since our deployment using ```cf push -f gen/srv```. It binds to the XSUAA service instance we deployed earlier.

    Replace the placeholders `((org))`, `((space))` and ``((domain))`` with their respective values.

1. Use the `cf push` command to push just the new UI application `cpapp-app` to Cloud Foundry:

    ```
    cf push
    ```

    It takes again about a minute for the deployment.

    In the deploy log, find the application URL in the routes line at the very end:

    ```
    name:              cpapp-app
    requested state:   started
    routes:            cpapp-app-***-***.cfapps.eu10.hana.ondemand.com
    ```

2. Open the URL in the browser.

??? failure "@TODO"
    - Link and a more appropriate description for XSUAA
    - Link and explanation for Scopes, Roles, Role-Templates, Role-Collections

??? warning "@TODO: Check with CAP Team"
    3 Different ways of deploying using CF push:

    - Deploying using Cloud Foundry [push](https://github.wdf.sap.corp/pages/cap/advanced/deploy-to-cloud#deploy-using-cf-push).

    After deployment there is no initial data.
    Only when this is added in `package.json`

    ```javascript
    "cds": {
        "requires": {
            "db": {
                "kind": "sql"
            }
        }
    }
    ```

    @TODO: Missing step?

    Also, in case there is security needed for the new service, a reference to the xsuaa service needs to be manually added to `gen/srv/manifest.yml`.

    ```yaml
    services:
    - cpapp-db
    - xsuaa_for_cpapp
    ```

    - Replaying the `cds deploy --to hana` using the individual [steps](https://github.wdf.sap.corp/pages/cap/guides/databases#alternative-deploying-manually).

    mentions binding of service keys

    ```
    cf create-service-key cpapp-db-hdi-container cpapp-db-hdi-container-key -c '{"permissions": "development"}'
    cf service-key cpapp-db-hdi-container cpapp-db-hdi-container-key
    ```

    and then subsequently copying the service key data to the ```default-env.json``` file
    Non of the steps seem to be needed though, the push works also if the steps are not carried out

    Documentation also mentions:

    In the db/ folder of the project, call:

    ```
    npm install         # invokes CDS build to generate SAP HANA files
    npm start -- --exit # deploys to the configured HDI container
    ```

	This is different to cf push -f gen/db

	In the db folder there is no package.json, so why ```npm i``` there?

    - Using `cds deploy --to hana` [deploy-to-hana](https://github.wdf.sap.corp/pages/cap/guides/databases#cds-deploy-hana)

    works however:

    - compiles only db folder
    - `cds build` as well as `cf push -f gen/src` still needs to be carried out, but nowhere mentioned
    - When `cds deploy --to hana` is carried out, there is no `cpaap-db` in CF, however using the alternative (`cf push -f gen/db` creates such an app). When is it needed and when it is not?

## Replacing placeholder on deployment

  Instead of putting the final values in, you can keep the placeholders `((org))`, `((space))`, and `((domain))` in the `manifest.yml` file and do the replacement on deployment.

  ```bash
  cf push \
    --var org=...
    --var space=...
    --var domain=...
  ```

  The advantage of this approach is that you can use the same manifest file for deployment to different landscapes, for example test and productive.

  You can use this for a sophisticated solution to set the values dynamically based on your current Cloud Foundry target:

  ```bash
  cf push \
    --var org=$(jq -r .SpaceFields.Name ~/.cf/config.json | sed s/[^a-z0-9]/-/ig) \
    --var space=$(jq -r .OrganizationFields.Name ~/.cf/config.json | sed s/[^a-z0-9]/-/ig) \
    --var domain=$(cf curl /v3/organizations/$(jq -r .OrganizationFields.GUID ~/.cf/config.json)/domains/default | jq -r .name)
  ```
## Undeployment

If you want to delete the deployment of all the parts, the SAP HANA DB, XSUAA, destination service, connectivity service, the CAP service, and AppRouter, you can carry out the following steps:

```bash
cf delete cpapp-app -f
cf delete cpapp-srv -f
cf delete cpapp-db-deployer -f
cf delete-service cpapp-db -f
cf delete-service cpapp-uaa -f
cf delete-service cpapp-destination -f
cf delete-service cpapp-connectivity -f
```
