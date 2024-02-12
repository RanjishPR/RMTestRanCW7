# Kyma Application with Authentication (WORK IN PROGRESS)

*** NOTE: This tutorial is still under development. Please send your feedback to uwe.klinger@sap.com ***

## Add Auth Checks


<!-- cpes-file srv/risk-service.cds -->
```text hl_lines="4-13 15-24"
using { sap.ui.riskmanagement as my } from '../db/schema';
@path: 'service/risk'
service RiskService {
  entity Risks @(restrict : [
            {
                grant : [ 'READ' ],
                to : [ 'RiskViewer' ]
            },
            {
                grant : [ '*' ],
                to : [ 'RiskManager' ]
            }
        ]) as projection on my.Risks;
    annotate Risks with @odata.draft.enabled;
  entity Mitigations @(restrict : [
            {
                grant : [ 'READ' ],
                to : [ 'RiskViewer' ]
            },
            {
                grant : [ '*' ],
                to : [ 'RiskManager' ]
            }
        ]) as projection on my.Mitigations;
    annotate Mitigations with @odata.draft.enabled;
}
```

## Enable Authentication

Add required packages to CAP project:

```bash
npm install --save @sap/xssec passport
```

### AppRouter

Create the docker file `approuter/Dockerfile` for the AppRouter:

<!-- cpes-file approuter/Dockerfile -->
```text
FROM node:10-slim
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 4004
CMD [ "npm", "start" ]
```

Create the script `approuter/server.js` to start the AppRouter and convert the Kubernetes XSUAA secret to `VCAP_SERVICES`:

<!-- cpes-file approuter/server.js -->
```js
var approuter = require('@sap/approuter');
const xsuaaCredentials = {};
for (const envName of Object.getOwnPropertyNames(process.env).filter( name => name.startsWith("xsuaa_"))) {
    const name = envName.substr("xsuaa_".length);
    xsuaaCredentials[name] = process.env[envName];
}
console.log(process.env);
console.log(xsuaaCredentials);
process.env.VCAP_APPLICATION = JSON.stringify({
        "application_uris": [
            process.env.APPROUTER_URL
        ]
});
process.env.VCAP_SERVICES = JSON.stringify({
    "xsuaa": [
        {
            "binding_name": null,
            "credentials": xsuaaCredentials,
            "instance_name": "xsuaa",
            "label": "xsuaa",
            "name": "xsuaa",
            "plan": "application",
            "provider": null,
            "syslog_drain_url": null,
            "tags": [
                "xsuaa"
            ],
            "volume_mounts": []
        }]
});
var ar = approuter();
ar.start({});
```


Create the `approuter/package.json` file:

<!-- cpes-file approuter/package.json -->
```json
{
    "name": "approuter",
    "dependencies": {
        "@sap/approuter": "^6.8.2"
    },
    "engines": {
        "node": "^10.0.0"
    },
    "scripts": {
        "start": "node server.js"
    }
}
```

Create the configuration file for the approuter `approuter/xs-app.json`:

<!-- cpes-file approuter/xs-app.json -->
```json
{
    "welcomeFile": "/app/launchpage.html",
    "authenticationMethod": "route",
    "sessionTimeout": 30,
    "logout": {
        "logoutEndpoint": "/do/logout",
        "logoutPage": "/"
    },
    "routes": [
        {
            "source": "^/(.*)$",
            "destination": "cpapp-binding",
            "authenticationType": "xsuaa"
        }
     ]
}
```

All requests will be routed to the CAP service.

Create the Kubernetes deployment specification for the approuter in file `deployment/approuter.yaml`:

<!-- cpes-file deployment/approuter.yaml -->
```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: cpapp-approuter-xsuaa
spec:
  instanceRef:
    name: cpapp-xsuaa
  secretName: cpapp-approuter-xsuaa
---
apiVersion: servicecatalog.kyma-project.io/v1alpha1
kind: ServiceBindingUsage
metadata:
  name: cpapp-approuter-xsuaa
spec:
  parameters:
    envPrefix:
      name: "xsuaa_"
  serviceBindingRef:
    name: cpapp-approuter-xsuaa
  usedBy:
    kind: deployment
    name: cpapp-approuter
---
apiVersion: v1
kind: Service
metadata:
  name: cpapp-approuter
  labels:
    app: cpapp-approuter
    service: cpapp-approuter
spec:
  ports:
  - port: 5000
    name: http
  selector:
    app: cpapp-approuter
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cpapp-approuter
  labels:
    account: cpapp-approuter
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpapp-approuter
  labels:
    app: cpapp-approuter
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cpapp-approuter
      version: v1
  template:
    metadata:
      labels:
        app: cpapp-approuter
        version: v1
    spec:
      serviceAccountName: cpapp-approuter
      containers:
      - name: cpapp-approuter
        image: docker-registry.{{CLUSTER_DOMAIN}}/cpapp-approuter
        imagePullPolicy: Always
        ports:
        - containerPort: 5000
        env:
          - name: httpHeaders
            value: >
              [
                {
                  "X-Frame-Options": "ALLOW-FROM https://{{FRAME_HOST}}"
                }
              ]
          - name: destinations
            value: >
              [ {
                "forwardAuthToken" : true,
                "name" : "cpapp-binding",
                "strictSSL" : true,
                "url" : "https://cpapp.{{CLUSTER_DOMAIN}}"
              } ]
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: cpapp-approuter-vs
spec:
  gateways:
  - kyma-gateway.kyma-system.svc.cluster.local
  hosts:
  - cpapp-approuter.{{CLUSTER_DOMAIN}}
  http:
  - name: "approuter-route"
    match:
    - uri:
        prefix: "/"
    route:
    - destination:
        host: cpapp-approuter
```

## Build and Push Docker Container

Establish port-forwarding by running the following command in a second command line window:

```bash
kubectl port-forward deployment/docker-registry 5000:5000
```

### AppRouter

```bash
docker build -t 0.0.0.0:5000/cpapp-approuter approuter
docker push 0.0.0.0:5000/cpapp-approuter
```

### CAP Service

```bash
cds build --production
docker build -t 0.0.0.0:5000/cpapp .
docker push 0.0.0.0:5000/cpapp
```

## Apply

`scripts/kubectl-apply.sh`:


<!-- cpes-file scripts/kubectl-apply.sh -->
```sh
#!/bin/bash
RD=$1
if [ "$RD" == "" ]; then
    echo >&2 "[ERROR] Please specify a kubernetes resource definition to apply"
    exit 1
fi
CLUSTER_DOMAIN="$(kubectl config current-context)"
if [ "$FRAME_HOST" == "" ]; then
    FRAME_HOST="$CLUSTER_DOMAIN"
fi
sed <$RD "s/{{CLUSTER_DOMAIN}}/${CLUSTER_DOMAIN}/" "s/{{FRAME_HOST}}//${FRAME_HOST}/" | kubectl apply -f -
```

Make it executable:

```bash
chmod +x scripts/kubectl-apply.sh
```

### XSUAA Service Instance

<!-- cpes-file deployment/cpapp-xsuaa-service-instance.yaml -->
```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: cpapp-xsuaa
spec:
  clusterServiceClassExternalName: xsuaa
  clusterServicePlanExternalName: application
  parameters:
    xsappname: RiskManagement
    tenant-mode: dedicated
    scopes:
      - name: $XSAPPNAME.RiskViewer
        description: RiskViewer
      - name: $XSAPPNAME.RiskManager
        description: RiskManager
    attributes: []
    role-templates:
      - name: RiskViewer
        description: generated
        scope-references:
          - $XSAPPNAME.RiskViewer
        attribute-references: []
      - name: RiskManager
        description: generated
        scope-references:
          - $XSAPPNAME.RiskManager
        attribute-references: []
    oauth2-configuration:
      redirect-uris:
        - "https://cpapp-approuter.{{CLUSTER_DOMAIN}}/login/callback"
```

```bash
./scripts/kubectl-apply.sh deployment/cpapp-xsuaa-service-instance.yaml
```

```bash
kubectl get serviceinstances cpapp-xsuaa
```

Result:
```
NAME          CLASS                       PLAN          STATUS   AGE
cpapp-xsuaa   ClusterServiceClass/xsuaa   application   Ready    2m20s
```

### XSUAA Service Binding


<!-- cpes-file deployment/cpapp-xsuaa-service-binding.yaml -->
```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: cpapp-xsuaa
spec:
  instanceRef:
    name: cpapp-xsuaa
#  secretName: cpapp-xsuaa
```

```bash
./scripts/kubectl-apply.sh deployment/cpapp-xsuaa-service-binding.yaml
```

```bash
kubectl get servicebinding cpapp-xsuaa
```

```
NAME          SERVICE-INSTANCE   SECRET-NAME   STATUS   AGE
cpapp-xsuaa   cpapp-xsuaa        cpapp-xsuaa   Ready    22s
```

```bash
kubectl get secret cpapp-xsuaa -o yaml
```

```
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  creationTimestamp: "2020-10-02T08:43:25Z"
  name: cpapp-xsuaa
  namespace: default
  ownerReferences:
  - apiVersion: servicecatalog.k8s.io/v1beta1
    blockOwnerDeletion: true
    controller: true
    kind: ServiceBinding
    name: cpapp-xsuaa
    uid: 31f713d8-7dda-4a8b-a3b8-043f2af7fd97
data:
  apiurl: aHR0...vbQ=
  clientid: c2It...wMjc
  clientsecret: RGZK...FPQ=
  identityzone: Y3Bl...dTIw
  identityzoneid: NmQ1...MzA5
  sburl: aHR0...Y29t
  subaccountid: NmQ1...MzA5
  tenantid: NmQ1...MzA5
  tenantmode: ZGVk...dGVk
  uaadomain: YXV0...vbQ=
  url: aHR0...vbQ=
  verificationkey: LS0t...tLQ=
  xsappname: Umlz...wMjc
  zoneid: NmQ1...MzA5
...
```

### XSUAA Service Binding Usage


<!-- cpes-file deployment/cpapp-xsuaa-service-binding-usage.yaml -->
```yaml
apiVersion: servicecatalog.kyma-project.io/v1alpha1
kind: ServiceBindingUsage
metadata:
  name: cpapp-xsuaa
spec:
  parameters:
    envPrefix:
      name: "cds_requires_uaa_credentials_"
  serviceBindingRef:
    name: cpapp-xsuaa
  usedBy:
    kind: deployment
    name: cpapp
```

```bash
./scripts/kubectl-apply.sh deployment/cpapp-xsuaa-service-binding-usage.yaml
```

```bash
kubectl get servicebindingusage cpapp-xsuaa
```

```
NAME          AGE
cpapp-xsuaa   109s
```

```bash
kubectl get pod cpapp-958464cd4-974p8 -o yaml
```

```
...
spec:
  containers:
  - envFrom:
    - secretRef:
        name: cpapp-kyma-db-secret
    - prefix: cds_requires_uaa_credentials_
      secretRef:
        name: cpapp-xsuaa
```


### CAP Service

```bash
./scripts/kubectl-apply.sh deployment/deployment.yaml
```

or:

```bash
kubectl rollout restart deployment cpapp
```


### AppRouter

<!-- cpes-file deployment/approuter.yaml -->
```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: cpapp-approuter-xsuaa
spec:
  instanceRef:
    name: cpapp-xsuaa
  secretName: cpapp-approuter-xsuaa
---
apiVersion: servicecatalog.kyma-project.io/v1alpha1
kind: ServiceBindingUsage
metadata:
  name: cpapp-approuter-xsuaa
spec:
  parameters:
    envPrefix:
      name: "xsuaa_"
  serviceBindingRef:
    name: cpapp-approuter-xsuaa
  usedBy:
    kind: deployment
    name: cpapp-approuter
---
apiVersion: v1
kind: Service
metadata:
  name: cpapp-approuter
  labels:
    app: cpapp-approuter
    service: cpapp-approuter
spec:
  ports:
  - port: 5000
    name: http
  selector:
    app: cpapp-approuter
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cpapp-approuter
  labels:
    account: cpapp-approuter
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpapp-approuter
  labels:
    app: cpapp-approuter
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cpapp-approuter
      version: v1
  template:
    metadata:
      labels:
        app: cpapp-approuter
        version: v1
    spec:
      serviceAccountName: cpapp-approuter
      containers:
      - name: cpapp-approuter
        image: docker-registry.{{CLUSTER_DOMAIN}}/cpapp-approuter
        imagePullPolicy: Always
        ports:
        - containerPort: 5000
        env:
          - name: httpHeaders
            value: >
              [
                {
                  "X-Frame-Options": "ALLOW-FROM https://{{FRAME_HOST}}"
                }
              ]
          - name: destinations
            value: >
              [ {
                "forwardAuthToken" : true,
                "name" : "cpapp-binding",
                "strictSSL" : true,
                "url" : "https://cpapp.{{CLUSTER_DOMAIN}}"
              } ]
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: cpapp-approuter-vs
spec:
  gateways:
  - kyma-gateway.kyma-system.svc.cluster.local
  hosts:
  - cpapp-approuter.{{CLUSTER_DOMAIN}}
  http:
  - name: "approuter-route"
    match:
    - uri:
        prefix: "/"
    route:
    - destination:
        host: cpapp-approuter
```

```bash
./scripts/kubectl-apply.sh deployment/approuter.yaml
```

```
kubectl get deployment cpapp-approuter
```

### Assign Roles

1. Go to *SAP BTP Cockpit*.
2. Choose your *Subaccount*.
3. Choose *Security* > *Role Collections*.
4. Choose *+* to add a new role collection.
5. Choose `RiskManager` as name.
6. Add role `RiskManager` in group *Roles*.
7. Add your e-mail address as user ID in group *Users*.
8. Choose *Save*.

## Try

```bash
echo "https://cpapp-approuter.$(kubectl config current-context)"
```