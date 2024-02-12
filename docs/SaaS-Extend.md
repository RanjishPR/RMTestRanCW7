
# Notes

* Standard way to get the URL --> We can explain it in our tutorial
* add extend permissions to the file --> cloud be done by the xs-security.json generator
* npm install kills the node_modules folder
* extension services are only displayed if the service is extended in `cds watch`
* extensions project have permission checks as well

https://cpessaasclient.authentication.sap.hana.ondemand.com/passcode

cds extend https://sap-cpes-refapps-saas-cflp-cpapp-srv.cfapps.sap.hana.ondemand.com -d ext

# Required Doc

* SaaS Developer Guide --> Risk Management SaaS + Capire
* Extension Developer Guide --> Could be also based on Risk Management + Capire

# Use Case Examples

* End-to-End Field Extension --> Add field to schema, service + UI
* Validation Extension
  * Add validation based on CDS
  * Add validation based on "FaaS"
* Add new Association / Composition --> Should this really be done in the extended service or should it be done in a separate service? What are pros and cons?