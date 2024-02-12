
# Service Broker

One approach to handle the Service Broker password is to store it in a user provided credential, so it can be easily updated and bound to the service-broker:

1. Create a user provided service with the user & password

    ```bash
    cf create-user-provided-service sb-credentials -p '{"admin": "<password>"}'
    ```

1. Add the `sb-credentials` service to your service broker application.

1. In th service broker the password needs to be extracted from the service credentials and handed over to the `Broker` object of the Service Broker Framework (`@sap/sbf`):

    ```javascript
    // https://github.wdf.sap.corp/xs2/node-sbf
    const Broker = require('@sap/sbf');
    const xsenv = require('@sap/xsenv');

    const brokerCredentialsServices = xsenv.getServices({ "user-provided": {"label": "user-provided", "name": "sb-credentials"}}, "default-services.json");
    if (brokerCredentialsServices.length !== 1) throw new Error("Service Broker Credentials not found.");
    const brokerCredentials = brokerCredentialsServices[0];
    if (Object.getOwnPropertyNames(brokerCredentials).length !== 1) throw new Error("Service Broker Credentials must contain one property with one value.");

    this.broker = new Broker({
        brokerCredentials,
        hooks: {
        ...
        }
    });

    ```