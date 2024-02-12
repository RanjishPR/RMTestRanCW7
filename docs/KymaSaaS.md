# CAP Service as Software-as-a-Service on Kyma (WORK IN PROGRESS)

*** NOTE: This tutorial is still under development. Please send your feedback to uwe.klinger@sap.com ***

## Preface

@todo

## Preconditions

To do this tutorial, the following preconditions are required:

@todo

## Include Multitenancy Module

```bash
npm install --save @sap/cds-mtx @sap/hdi-deploy @sap/instance-manager
```

The CAP multitenancy module needs to be plugged into the request handling of CAP, therefore an own server implementation is required.

Create a file `srv/server.js` with the following content:

<!-- cpes-file srv/server.js -->
```js
const cds = require ('@sap/cds');
cds.on('bootstrap', (app) => {
    if (cds.env.env !== "development")
        cds.mtx.in(app); // serve cds-mtx APIs
});
// Delegate bootstrapping to built-in server.js
module.exports = cds.server;
```

## Add CDS Configuration for Multitenancy Database

The multitenancy mode needs to be enabled in the CAP DB configuration.

Add the database configuration for multitenancy in the `package.json` file.

The database kind must be set to `hana` because of this issue: https://github.wdf.sap.corp/cap/issues/issues/5553. <!-- @todo -->

<!-- cpes-file package.json:cds.requires.db -->
```json hl_lines="2-2 6-6 8-16"
{
  "name": "cpapp",
  ...
  "cds": {
    "requires": {
      "API_BUSINESS_PARTNER": "...",
      "db": {
        "kind": "hana",
        "multiTenant": true,
        "model": [
          "db",
          "srv"
        ],
        "vcap": {
          "label": "managed-hana"
        }
      }
    }
  }
}
```

!!! warning "The OData version needs to be explicitly set to "v4", otherwise CAP returns OData "v2" in multitenancy mode.

  This shall be solved with cds 4.x.
  <!-- @todo--> Bug report: https://github.wdf.sap.corp/cap/issues/issues/4819"

<!-- cpes-file package.json:cds.odata -->
```json

```

## SAAS Registry

<!-- cpes-file deployment/saas-registry.yaml -->
```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: cpapp-saas-registry
spec:
  clusterServiceClassExternalName: saas-registry
  clusterServicePlanExternalName: application
  parameters:
    appName: RiskManagement
    appUrls:
      onSubscription: >-
        https://cpapp.{{CLUSTER_DOMAIN}}/mtx/v1/provisioning/tenant/{tenantId}
    displayName: Risk Management
    description: Risk Management SaaS Application
    category: CAP
```

sed <deployment/saas-registry.yaml "s/{{CLUSTER_DOMAIN}}/$(kubectl config current-context)/" | kubectl apply -f -


## Create Service Manager on Cloud Foundry

MTX uses the `service-manager` service with the plan `container` to create and delete HDI containers during tenant on- and offboarding.

```bash
cf create-service service-manager container cpapp-kyma-service-manager
cf create-service-key cpapp-kyma-service-manager cpapp-kyma-service-manager-key
```

## Create Kubernetes Secret with Service Manager Credentials

Create a new file `gen/inst-manager-secret.yaml` with the following content:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cpapp-kyma-service-manager-secret
type: opaque
stringData:
  VCAP_SERVICES: >
    {
      "managed-hana": [
        {
          "credentials": {{CREDENTIALS}},
          "instance_name": "cpapp-kyma-inst-manager",
          "label": "managed-hana",
          "name": "cpapp-kyma-inst-manager",
          "plan": "hdi-shared",
          "tags": [
            "managed-hana",
            "managed-database",
            "managed-relational",
            "xsa-instancemanager"
          ]
        }
      ]
    }
```

Execute this command to automatically replace the `{{CREDENTIALS}}` placeholder with the credentials from the Cloud Foundry service key and apply it as a Kubernetes secret:

```bash
node -e 'console.log(process.argv[1].replace("{{CREDENTIALS}}", process.argv[2]))' "$(cat gen/inst-manager-secret.yaml)" "$(cf service-key cpapp-kyma-inst-manager cpapp-kyma-inst-manager-key | sed 1d | sed 's/^/    /')" | kubectl apply -f -
```

Start port-forwarding to the docker registry (will run in the background):

```bash
kubectl port-forward deployment/docker-registry 5000:5000 &
```

Build the CAP project, the docker image and push to the docker registry:

```bash
cds build --production
docker build -t 0.0.0.0:5000/cpapp .
docker push 0.0.0.0:5000/cpapp
```

### Application

Deploy the CAP application to Kubernetes:

```
sed <deployment/deployment.yaml "s/{{CLUSTER_DOMAIN}}/$(kubectl config current-context)/" | kubectl apply -f -
```

### Application Host

Apply an API rule to be able to access the CAP service:

```bash
sed <deployment/apirule.yaml "s/{{CLUSTER_DOMAIN}}/$(kubectl config current-context)/" | kubectl apply -f -
```

Now, you can log in the application. To get its URL run:

```bash
echo https://cpapp.$(kubectl config current-context)
```

If something fails and you need to update the docker container, then you can restart the application with the new container by executing:

```bash
kubectl rollout restart deployment cpapp
```

### AppRouter

Build the

```bash
docker build -t 0.0.0.0:5000/cpapp-approuter approuter
docker push 0.0.0.0:5000/cpapp-approuter
```

```bash
sed <deployment/approuter.yaml "s/{{CLUSTER_DOMAIN}}/$(kubectl config current-context)/" | kubectl apply -f -
```

### Example Host

Create the virtual host to bind the host name for an example tenant to the approuter:

```
sed <deployment/example-tenant-host.yaml "s/{{CLUSTER_DOMAIN}}/$(kubectl config current-context)/" | kubectl apply -f -
```

## Debugging

```bash
kubectl port-forward deployment/cpapp 9229:9229
```
