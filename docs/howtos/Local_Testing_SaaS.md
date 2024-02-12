# Local Testing Software-as-a-Service Applications

!!! warning "This how to is under development!"

## Goal

The following scenarios should be testable without the need to deploy the application:

1. Test subscribe and unsubscribe applications.
2. Test service with subscribed application.
3. Test UI and service with subscribed application (with launchpage w/o portal).

## Precondition

1. A Cloud Foundry space with a version of the application that is already deployed.
2. An SAP BTP subaccount to test the subscription process.
3. To test service and UI with a subscribed account, the account must be already subscribed via SAP BTP, because only in this case the authorization token can be created.

## Setup

CAP Service (http://localhost:4004)
* &rarr; XSUAA (SAP BTP)
* &rarr; Service Manager (SAP BTP)
* &rarr; SAP HANA (SAP BTP) - via Service Manager managed HDI containers

AppRouter (http://localhost:5000)
* &rarr; CAP Service (http://localhost:4004)
* &rarr; XSUAA (SAP BTP)

## Credentials

## Retrieve a JWT Token for Testing

**@todo**
## Testing Local CAP Service

1. Download credentials for Approuter and CAP service and adjust environment variables for local testing:

    ```bash
    ./scripts/build-default-env.sh <app-name>
    ```

2. Run the CAP Service:

    The CAP Service needs to run in `productive` mode to use the cloud services.

    **@todo:** Why isn't it working with cds watch? Why is `productive mode` for XSUAA required? Can we do it differently?

    ```
    NODE_ENV=productive cds serve
    ```

## UI Testing with Local AppRouter

1. Modify the `mta.yaml` file to allow login from local AppRouter:

    **@todo:** Should be done modification free with an `MTAEXT` file.

    ```yaml
    _schema-version: '3.1'
    ID: cpapp-local-testing
    extends: cpapp
    version: 1.0.0

    resources:

    - name: cpapp-uaa
      parameters:
        config:
          oauth2-configuration:
              redirect-uris:
                - http://*.localhost:5000/login/callback
    ```

2. Deploy application with updated service:

    ```bash
    cf deploy cpapp_1.0.0.mtar -e local-testing.mtaext -r cpapp-uaa
    ```

3. Add a route to the local app files.

    This is already prepared as part of the `approuter/server.js` script using `approuter/local-app-route.js`. It adds the following route dynamically to the Approuter, so that the UI files are served by the CAP service automatically.

    This gets enabled if the env variable `LOCAL_APP_ROUTE` is set.

    Added route:

    ```json
        {
            "source": "^/app/(.*)$",
            "target": "$1",
            "destination": "srv-api",
            "authenticationType": "xsuaa"
        }
    ```

4. Download credentials for Approuter and CAP service and adjust environment variables for local testing:

    ```bash
    ./scripts/build-default-env.sh <app-name>
    ```

    (Replace `<app-name>` with the name of the cap service app, for example, `cpapp-srv`.)

    By running the script the credentials are downloaded and the environment variables `TENANT_HOST_PATTERN` and `destinations` modified to match the local scenario:

    ```
    TENANT_HOST_PATTERN = "(.*).localhost"
    LOCAL_APP_ROUTE = true
    destinations = JSON.stringify([
        {
            forwardAuthToken: true,
            strictSSL: true,
            name: "srv-api",
            url: "http://localhost:4004"
        }
    ```

5. Start Approuter:

    ```bash
    ( cd approuter; npm start )
    ```

## Fake UAA Setup

**@todo**: Test on- and offboarding with a fake UAA. The fake UAA can provide JWT tokens with a tenant. This will simplify the setup, because no subaccounts for subscription are required.

## Subscribe a Subaccount

**@todo** Provide script to subscribe a subaccount.

## UI Testing with Portal

**@todo** What are the options for these beyond deploying the whole app?

## Running Automated Tests

**@todo** Automatically setup the scenario and run tests, for example, in a pipeline.
