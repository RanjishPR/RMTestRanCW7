# Create a Service Broker

## Prep

* Add entitlement for service `auditlog` `standard`

## Implement Service Broker

https://www.npmjs.com/package/@sap/sbf

mkdir service-broker
cd service-broker
npm init
npm install @sap/sbf

package.json:

  "scripts": {
    "start": "start-broker"
  },

  "engines": {
    "node": "^10"
  }

catalog.json


npx gen-catalog-ids

2 ids added to catalog.json: [
  "services[0].id <- d6cd57ae-6961-4f5b-9e6d-f1c20ca64231",
  "services[0].plans[0].id <- 1d83f716-017d-496a-b647-f1cf7352be90"
]

service:
- name: cpapp-auditlog

change plan for xusaa to "broker"

- name: cpapp-uaa
  ...
  parameters:
    ...
    service-plan: broker


# Registration

https://wiki.wdf.sap.corp/wiki/display/comppurc/Using+Service+Manager+to+register+a+subaccount-scoped+service+broker


npx hash-broker-password -b

Plaintext password:
kklsYln7dI+bVtzD+R1Udu0sh9mDh/Zu
Hashed credentials:
sha256:2c/cjYKfR4ZeB8tDSNtYUbLkjOn58dNUhdcGBE7y83g=:Q2zRpINtj0PCGq5ckdqqdKleKDTVOSc8PFKdh+52YkI=

--> use hashed in mta.yaml

## Service Broker Registration in Service Manager

* Subscribe to service manager in cockpit (Cloud Service Management Service)
* Add user to `Subaccount Service Administrator` role collection

LANDSCAPE_DOMAIN=sap.hana.ondemand.com
SUBDOMAIN=cpesrefapps
smctl login -a https://service-manager.cfapps.$LANDSCAPE_DOMAIN --param subdomain=$SUBDOMAIN


smctl register-broker cpapp-service-broker https://sap-cpes-refapps-uwe-cpapp-service-broker.cfapps.sap.hana.ondemand.com "Risk Management Service Broker" -b "broker-user:kklsYln7dI+bVtzD+R1Udu0sh9mDh/Zu"