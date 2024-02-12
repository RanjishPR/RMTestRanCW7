# Use Custom Domains for Your Application

This tutorial explains how to use a custom domain for a Cloud Foundry application.

Each Cloud Foundry landscape has a "default domain" which can used for applications. For example, the `cf-eu10-canary` landscape provides the domain `cfapps.sap.hana.ondemand.com`.

This allows to create routes to hosts underneath this, domain. For example, an application can be bound to: `https://app.cfapps.sap.hana.ondemand.com`.

But different domains or subdomains can't be used out of the box, for example:

* `https://app.subdomain.cfapps.sap.hana.ondemand.com`
* `https://app.different-domain.com`

!!! warning "Please Note"

    * This is a compressed version that should help to give orientation in the process. It doesn't replace the official documentation.
    * Please read [Quick Guide - SAP Domain and DNS Policies
    ](https://jam4.sapjam.com/wiki/show/x1cX0kzUMRbmcPlzTB3qRb?_lightbox=true) to understand all implications.
    * It is intended for SAP products on SAP Cloud Platform Cloud Foundry
    * It covers the use case of wildcard custom domain, such as `*.different-domain.com`.

## Domain Approval and DNS Mapping @ SAP

The first step is to get the approval of the owner of the domain:

* [Quick Guide - SAP Domain and DNS Policies](https://jam4.sapjam.com/wiki/show/x1cX0kzUMRbmcPlzTB3qRb?_lightbox=true) > 2.

## Security Concept

* [Quick Guide - SAP Domain and DNS Policies](https://jam4.sapjam.com/wiki/show/x1cX0kzUMRbmcPlzTB3qRb?_lightbox=true) > 4.

You might try to use the [Self-Service](https://securityselfservice-sapitcloud.dispatcher.hana.ondemand.com/).

## DNS Registration

* [Quick Guide - SAP Domain and DNS Policies](https://jam4.sapjam.com/wiki/show/x1cX0kzUMRbmcPlzTB3qRb?_lightbox=true) > 3.

The IP addresses of the regions proxy need to be provided for the registration of your domain. They can be determined with:
```bash
nslookup <cf-api-endpoint>
```

For example, for AWS CANARY:
```
nslookup https://api.cf.sap.hana.ondemand.com
```

*Result:*
```
Server:         10.17.220.85
Address:        10.17.220.85#53

Non-authoritative answer:
https://api.cf.sap.hana.ondemand.com    canonical name = cf-proxy-aws-canary-1557a93e4013df58.elb.eu-central-1.amazonaws.com.
Name:   cf-proxy-aws-canary-1557a93e4013df58.elb.eu-central-1.amazonaws.com
Address: 3.120.220.137
Name:   cf-proxy-aws-canary-1557a93e4013df58.elb.eu-central-1.amazonaws.com
Address: 52.29.161.163
Name:   cf-proxy-aws-canary-1557a93e4013df58.elb.eu-central-1.amazonaws.com
Address: 18.195.178.250
```

When creating the ticket as described in the link above, the IPs need to be added. The request could look like this for example:

```
Dear Colleagues,

Please register the wildcard domain *.cpes-refapps.int.sap to the CF EU10 CANARY landscape IPs:
*.cpes-refapps.int.sap    IN A     3.120.220.137
*.cpes-refapps.int.sap    IN A    18.195.178.250
*.cpes-refapps.int.sap    IN A     52.29.161.163

Domain name: cpes-refapps.int.sap
Product/service name: Cloud Platform Extension Suite (CPES) Reference Applications
Business Contact: Martin Botschek (D021686)
Technical Contact: Uwe Klinger (D038359)
Escalation process (ticket system) or contacts: Martin Botschek (D021686), Uwe Klinger (D038359)
Category how important this DNS entries are: Internal education
```

!!! note "Don't forget to attach your security concept and domain owner approval"

### Check DNS Entry

Check if the DNS entry exists as requested once the ticket is completed.

* Mac: `dig *.<domain>`
* Win: `nslookup *.<domain>`

*For example:*

* Mac: `dig *.cpes-refapps.int.sap`
* Win: `nslookup *.cpes-refapps.int.sap`

Look for the `ANSWER SECTION`

For example for `*.cpes-refapps.int.sap`:
```
# dig *.cpes-refapps.int.sap | sed -n "/;; ANSWER SECTION:/,/;;/p"

;; ANSWER SECTION:
*.cpes-refapps.int.sap. 3357    IN      A       3.120.220.137
*.cpes-refapps.int.sap. 3357    IN      A       52.29.161.163
*.cpes-refapps.int.sap. 3357    IN      A       18.195.178.250

;; AUTHORITY SECTION:
```

## Custom Domain Registration and Certificate

Please read the excellent guide [SAP Stakeholder´s Guide to Custom Domains
](https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=2098634698) for details.

### Custom Domain Plugin Installation

The `Custom Domain` plugin is required for the `cf` CLI. To install it:

1. Goto https://tools.hana.ondemand.com/#cloud
1. Download `custom-domain-cli-*` for your platform
1. Install the plugin

*macOS:*

```bash
# Install
cd ~/Downloads
tar -xvzf custom-domain-cli-*.tar.gz
cf install-plugin */custom-domain-cli

# Clean-up
rm */custom-domain-cli
rm custom-domain-cli-*.tar.gz
```

*Windows:*

1. Unzip the downloaded file
2. Copy the binary to a location that is covered by your `%PATH%` env variable

### Custom Domain Service Entitlement

Make sure the required entitlement for the `Custom Domains Certficate` service is available: [Prepare SAP Cloud Platform and Cloud Foundry](Prepare-BTP.md)

## Custom Domain SSL Certificate

### Create Space and Custom Domains Service Instance

Create Cloud Foundry space:

```bash
cf create-space custom-domains
cf target -s custom-domains
```

Add users to the space:

```bash
cf set-space-role <user> <cf-org> <cf-space> SpaceManager
```

Create custom domains service:
```bash
cf create-service INFRA custom_domains custom-domains-service
cf custom-domain-list
```

Check quota:

```bash
cf custom-domain-list
```

```hl_lines="7"
Command: custom-domain-list
Organisation:  SAP_cpes_refapps  (c1402a2b-6529-4dda-a0db-4537b1a843f4)
API Endpoint:  https://api.cf.sap.hana.ondemand.com
Default API Server:  https://custom-domain-certificates-api.cf.sap.hana.ondemand.com

Activated Certificates: 0
Activated Certificates Quota: 1

There are no domains configured
```

### Create Domain and Share it in the CF Organization

```bash
cf create-domain <cf-org> <domain>
cf share-private-domain <cf-org> <domain>
```

*Example:*
```bash
cf create-domain SAP_cpes_refapps cpes-refapps.int.sap
cf share-private-domain SAP_cpes_refapps cpes-refapps.int.sap
```

### Create Certificate Sign Request

```bash
cf custom-domain-create-key <key> 'CN=*.<domain>' '*.<domain>'
cf custom-domain-get-csr <key> <pem-file>
```

*Example:*
```bash
cf custom-domain-create-key cpes-refapps-key "CN=*.cpes-refapps.int.sap" '*.cpes-refapps.int.sap'
while ! cf custom-domain-get-csr cpes-refapps-key cpes-refapps-csr.pem; do
    sleep 1
done
```

The output, from `-----BEGIN CERTIFICATE REQUEST-----` to `-----END CERTIFICATE REQUEST-----` (including both lines) is required for the Certificate Request.

### Certificate Request

Please, follow the instructions here: [SAP Stakeholder´s Guide to Custom Domains > DigiCert Request](
https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=2098634698#SAPStakeholder%C2%B4sGuidetoCustomDomains-7.DIGICERTREQUEST)

### Upload Certificate Chain

After some time you will receive a mail from DigiCert containing the signed certificate and the intermediate certificate.

1. Save content from first `-----BEGIN CERTIFICATE-----` to the last `-----END CERTIFICATE-----` to file `cpes-refapps-key-chain.pem` in a file `<key-chain-pem>`
1. Goto [https://github.tools.sap/sgs/SAP-Global-Trust-List/blob/master/Approved/DigiCert%20Global%20Root%20CA.pem](https://github.tools.sap/sgs/SAP-Global-Trust-List/blob/master/Approved/DigiCert%20Global%20Root%20CA.pem)
1. Click *Sign in With SAML* (if not yet signed in)
1. Click *RAW*
1. Copy complete content and append it to file `<key-chain-pem>`
1. Upload certficate chain:

    ```bash
    cf custom-domain-upload-certificate-chain <key> <key-chain-pem>
    ```

*Example:*

1. Save content from first `-----BEGIN CERTIFICATE-----` to the last `-----END CERTIFICATE-----` to file `cpes-refapps-key-chain.pem`.
1. Goto [https://github.tools.sap/sgs/SAP-Global-Trust-List/blob/master/Approved/DigiCert%20Global%20Root%20CA.pem](https://github.tools.sap/sgs/SAP-Global-Trust-List/blob/master/Approved/DigiCert%20Global%20Root%20CA.pem)
1. Click *Sign in With SAML* (if not yet signed in)
1. Click *RAW*
1. Copy complete content and append it to file `cpes-refapps-key-chain.pem`
1. Upload certficate chain:

    ```
    cf custom-domain-upload-certificate-chain cpes-refapps-key cpes-refapps-key-chain.pem
    ```

### Custom Domain Activation

```
cf custom-domain-activate <key> <domain>
```

*Example:*

```
cf custom-domain-activate cpes-refapps-key '*.cpes-refapps.int.sap'
```

### Wait for activation

#### Custom Domain Activation

The previously triggered domain activation need to be completed first, before the domain can be used. This is checked with:

```
cf custom-domain-list
```

*Example:*

```hl_lines="14"
Command: custom-domain-list
Organisation:  SAP_cpes_refapps  (c1402a2b-6529-4dda-a0db-4537b1a843f4)
API Endpoint:  https://api.cf.sap.hana.ondemand.com
Default API Server:  https://custom-domain-certificates-api.cf.sap.hana.ondemand.com

Activated Certificates: 1
Activated Certificates Quota: 1

Domain Name:             *.cpes-refapps.int.sap
Key:                     cpes-refapps-key
Key Status:              created, certificate chain uploaded
Certificate Status:      valid
Client Authentication:   disabled
Custom Domain Status:    activated
```

Once the Certificate is activated, it will still take up to an hour to become effective. To check the state, the `openssl` or `curl` command can be used.

#### Check with OpenSSL client

```
echo -n | openssl s_client -connect <domain>:443  -servername *.<domain>
```

*Example:*

```
echo -n | openssl s_client -connect app.cpes-refapps.int.sap:443  -servername *.cpes-refapps.int.sap
```

#### Check with CURL

This requires that you have already mapped the new route to your application.

```
curl <url>
```

*Example:*

```
curl https://app.cpes-refapps.int.sap
```

```
curl https://app.cpes-refapps.int.sap:443
curl: (60) SSL: no alternative certificate subject name matches target host name 'app.cpes-refapps.int.sap'
More details here: https://curl.haxx.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.
```

### Map Route

```bash
cf map-route <app> <domain> --hostname <hostname>
```

*Example:*

```bash
cf map-route cpapp-app cpes-refapps.int.sap --hostname app
```

### Configure Login Redirect URL

The XSUAA service accepts only certain URLs as target to complete the login. Therefore, the new URL need to be added to the list of redirect URLs overwriting the default behavior of the XSUAA.

Add the section `oauth2-configuration` to your `xs-security.json`:

```json hl_lines="3-9"
{
    ...
    "oauth2-configuration": {
		"credential-types": ["binding-secret"],
		"redirect-uris": [
            "https://sap-cpes-refapps-dev-cpapp-app.cfapps.sap.hana.ondemand.com/login/callback",
            "https://app.cpes-refapps.int.sap/login/callback"
        ]
	}
}
```

### Add Route Permanently

The route mapped using `cf map-route` will be lost when deploying the application newly. Therefore, it should be added to the `mta.yaml` file:

```yaml hl_lines="5-9"
modules:
 - name: cpapp-app
   type: nodejs
   path: app
   parameters:
     routes:
       - route: ${default-url}
       - route: https://app.cpes-refapps.int.sap
```

The `${default-url}` has been kept to still allow the access with the previously used URL. But it can also be deleted.

@todo

#### (TODO) Configuration With a Custom Domain

If you have a SaaS application (see [Make Your Application Subscribable by Other Subaccounts](../SaaS)), change the values of the respective properties in the `mta.yaml` file:

```yaml hl_lines="1 3"
tenant-delimiter: '.'
...
app-fqdn: '<custom-domain>'
```

Further, you change the

```yaml hl_lines="5"
- name: cpapp-approuter
  ...
  parameters:
    routes:
      - route: <custom-domain>
```

(Where `custom-domain` is your custom domain, for example `my-saas-app.cloud.com`.)

@TODO: Built the application again

#### (TODO) Call your Custom Domain

In case you add your custom domain, the syntax is:

`https://<subaccount-subdomain>.<custom-domain>`

## Certificate Renewal

Domain Certificates issued by Digicert are valid for one year. Before expiration, the certificate needs to be renewed via a new Digicert Request. Renewal Recommendation is 2-3 weeks before actual expiration in case there are difficulties.

To renew in a Blue-Green manner, follow this section in the guide: https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=2098634698#SAPStakeholder%C2%B4sGuidetoCustomDomains-13.CERTIFICATELIFECYCLEMANAGEMENT-RENEWAL

## Monitoring

@todo
