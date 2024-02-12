
# app/build

```text 
#!/bin/bash
set -e
cd "$(dirname "$0")"
rm -rf dist
mkdir dist
for APP in *; do
    if [ -f "$APP/webapp/manifest.json" ]; then
        echo "Build $APP"
        mkdir "dist/$APP"
        cp -r "$APP/webapp/" "dist/$APP/"
        cp xs-app-for-apps.json "dist/$APP/xs-app.json"
        cd "dist/$APP"
        zip -r -o manifest-bundle.zip manifest.json i18n
        cd "../.."
    fi
done
```

# mta.yaml

```yaml hl_lines="24-28 34-36 62-64 140-142 154-157 200-201 208-209 210-211 219-220 223-224 225-241 249-265"
## Generated mta.yaml based on template version 0.2.0
## appName = cpsaasapp
## language=nodejs; multiTenant=false
## approuter=
_schema-version: '3.1'
ID: cpsaasapp
version: 1.0.0
description: "A simple CAP project."
parameters:
  enable-parallel-deployments: true
build-parameters:
  before-all:
   - builder: custom
     commands:
      - npm install
      - npx cds build\/all
      - bash -c "find gen -type f -name '*.csv' | xargs rm -f"
modules:
 - name: cpsaasapp-app
   type: nodejs
   path: app
   properties:
     TENANT_HOST_PATTERN: "^(.*)~{srv-multi-tenancy/tenant-delimiter}${default-host}.${default-domain}"

     SAP_JWT_TRUST_ACL: >
        [
          {"clientid":"*","identityzone":"sap-provisioning"}
        ]

   provides:
    - name: app-binding
      properties:
        app-url: ${default-url}

        app-host: ${default-host}
        app-domain: ${default-domain}

   parameters:
     routes:
       - route: ${default-url}
       - route: https://app.cpes-refapps.int.sap
   requires:
    - name: cpsaasapp-uaa
    - name: cpsaasapp-logs
    - name: srv-binding
      group: destinations
      properties:
        forwardAuthToken: true
        strictSSL: true
        name: srv-binding
        url: ~{srv-url}
    - name: srv-health-binding
      group: destinations
      properties:
        forwardAuthToken: false
        strictSSL: true
        name: srv-health-binding
        url: ~{srv-health-url}
    - name: srv-multi-tenancy
    - name: cpsaasapp-portal
    - name: cpsaasapp-html5-repo-runtime

    - name: cpsaasapp-ui-saas-registry
    - name: cpsaasapp-saas-service


 # --------------------- SERVER MODULE ------------------------
 - name: cpsaasapp-srv
 # ------------------------------------------------------------
   type: nodejs
   path: gen/srv
   properties:
     EXIT: 1  # required by deploy.js task to terminate
   requires:
    # Resources extracted from CAP configuration
    - name: cpsaasapp-db
    - name: cpsaasapp-uaa
    - name: cpsaasapp-logs
    - name: cpsaasapp-saas-registry
    - name: app-binding
      properties:
        APP_URL: ~{app-url}
        TENANT_DELIMITER: "-"
        SAP_JWT_TRUST_ACL: >
          [
            {"clientid":"*","identityzone":"sap-provisioning"}
          ]
   provides:
    - name: srv-binding      # required by consumers of CAP services (e.g. approuter)
      properties:
        srv-url: ${default-url}
    - name: srv-health-binding
      properties:
        srv-health-url: ${default-url}
    - name: srv-multi-tenancy
      properties:
        tenant-delimiter: "-"
#  # -------------------- SIDECAR MODULE ------------------------
#  - name: db
#  # ------------------------------------------------------------
#    type: hdb
#    path: gen/db
#    parameters:
#      app-name: cpsaasapp-db
#    build-parameters:
#      builders:
#        - builder: custom
#          commands:
#            - echo
#    requires:
#     # 'hana' and 'xsuaa' resources extracted from CAP configuration
#     - name: cpsaasapp-db
#     - name: cpsaasapp-uaa
 - name: cpsaasapp-ui-deployer
   type: com.sap.html5.application-content
   path: ui-deployer
   requires:
     - name: cpsaasapp-html5-repo-host
     - name: cpsaasapp-logs
   properties:
     APP_LOG_LEVEL: "debug"
   build-parameters:
     requires:
       - name: cpsaasapp-ui
         artifacts:
           - './*'
         target-path: resources
 - name: cpsaasapp-ui
   type: html5
   path: app
   build-parameters:
     builder: custom
     commands:
       - ./build
     supported-platforms: []
     build-result: dist
 - name: cpsaasapp-portal-content-deployer
   type: com.sap.portal.content
   path: portal-content

   properties:
     TENANT_HOST_PATTERN: "^(.*)~{srv-multi-tenancy/tenant-delimiter}~{app-binding/app-host}.~{app-binding/app-domain}"

   parameters:
     stack: cflinuxfs3
     memory: 128M
     buildpack: "https://github.com/cloudfoundry/nodejs-buildpack/releases/download/v1.6.39/nodejs-buildpack-cflinuxfs3-v1.6.39.zip"
   requires:
     - name: cpsaasapp-portal
     - name: cpsaasapp-uaa
     - name: cpsaasapp-logs
     - name: cpsaasapp-html5-repo-host
     - name: cpsaasapp-ui-deployer

     - name: cpsaasapp-ui-saas-registry
     - name: app-binding
     - name: srv-multi-tenancy


resources:
# services extracted from CAP configuration
# 'service-plan' can be configured via 'cds.requires.<name>.vcap.plan'
# ------------------------------------------------------------
 - name: cpsaasapp-db
# ------------------------------------------------------------
   type: org.cloudfoundry.managed-service
   parameters:
     service: managed-hana
     service-plan: hdi-shared
# ------------------------------------------------------------
 - name: cpsaasapp-uaa
# ------------------------------------------------------------
   type: org.cloudfoundry.managed-service
   parameters:
     service: xsuaa
     service-plan: application
     path: ./xs-security.json
     config:
       xsappname: cpsaasapp-${space}    #  name + space dependency
       ##  path to xs-security.json to add roles and scopes
       # path: ./xs-security.json
       ## or inline definition
       # scopes:
       # - name: $XSAPPNAME...
 - name: cpsaasapp-portal
   type: org.cloudfoundry.managed-service
   parameters:
     service-plan: standard
     service: portal
 - name: cpsaasapp-html5-repo-runtime
   parameters:
     service-plan: app-runtime
     service: html5-apps-repo
   type: org.cloudfoundry.managed-service
 - name: cpsaasapp-html5-repo-host
   parameters:
     service-plan: app-host
     service: html5-apps-repo
   type: org.cloudfoundry.managed-service



 - name: cpsaasapp-logs
   type: org.cloudfoundry.managed-service
   parameters:
     service: application-logs
     service-plan: standard

[DELETE]  - name: cpsaasapp-saas-registry
[DELETE] 
 - name: cpsaasapp-ui-saas-registry

   type: org.cloudfoundry.managed-service
   parameters:
      service: saas-registry
      service-plan: application
      config:
        xsappname: cpsaasapp-${space}

        appName: cpsaasapp-ui-${space}

        appUrls:

[DELETE]           getDependencies:
[DELETE] 
          getDependencies: "~{app-binding/app-url}/callback/v1.0/dependencies"
          onSubscription: "~{app-binding/app-url}/callback/v1.0/tenants/{tenantId}"
        displayName: "Risk Management (UI)"
        description: "Risk Management SaaS Application (UI)"
        category: CAP
   requires:
     - name: app-binding
 - name: cpsaasapp-saas-registry
   type: org.cloudfoundry.managed-service
   parameters:
      service: saas-registry
      service-plan: service
      config:
        xsappname: cpsaasapp-${space}
        appName: cpsaasapp-${space}
        appUrls:

          onSubscription: "~{srv-binding/srv-url}/mtx/v1/provisioning/tenant/{tenantId}"
        displayName: "Risk Management"
        description: "Risk Management SaaS Application"
        category: CAP
   requires:
     - name: srv-binding


 - name: cpsaasapp-saas-service
   type: org.cloudfoundry.user-provided-service
   parameters:
    config:
      endpoints:
        srv:
          url: "~{srv-binding/srv-url}"
      uaa:
        xsappname: "cpsaasapp-dev!t11998"
      sap.cloud.service: "com.sap.cpes.refapps.cpsaasapp"
      saasregistryenabled: true
      forwardAuthToken: true
      saasregistryappname: cpsaasapp-${space}
   requires:
     - name: srv-binding

```

# package.json

```json hl_lines="26-36 62-62 63-64"
{
  "name": "cpsaasapp",
  "version": "1.0.0",
  "description": "A simple CAP project.",
  "repository": "<Add your repository here>",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "@sap/cds": "^3",
    "@sap/cds-mtx": "^1.0.13",
    "@sap/hana-client": "^2.4.194",
    "@sap/hdi-deploy": "^3.11.9",
    "@sap/instance-manager": "^2.1.0",
    "@sap/xsenv": "^2.2.0",
    "@sap/xssec": "^2.2.5",
    "express": "^4",
    "passport": "^0.4.1"
  },
  "scripts": {
    "start": "node srv/srv-server.js"
  },
  "sapux": [
    "app/risks"
  ],
  "cds": {

[DELETE]     "[development]": {
[DELETE]       "requires": {
[DELETE]         "db": {
[DELETE]           "kind": "sqlite",
[DELETE]           "credentials": {
[DELETE]             "database": ":memory:"
[DELETE]           }
[DELETE]         }
[DELETE]       }
[DELETE]     },
[DELETE] 
    "requires": {
      "uaa": {
        "kind": "xsuaa",
        "credentials": {}
      },
      "db": {
        "kind": "hana",
        "model": [
          "db",
          "srv"
        ],
        "multiTenant": true,
        "vcap": {
          "label": "managed-hana"
        }
      }
    },
    "odata": {
      "version": "v4"
    },
    "hana": {
      "syntax": "hdi"
    }
  }

[DELETE] }
}

```

# portal-content/portal-site/CommonDataModel.json

```json hl_lines="68-70 71-72"
{
	"_version": "3.0.0",
	"identification": {
		"id": "6932eea5-9904-42a4-a742-15bb38d5e640-1587099697547",
		"entityType": "bundle"
	},
	"payload": {
		"catalogs": [{
			"_version": "3.0.0",
			"identification": {
				"id": "defaultCatalogId",
				"title": "{{title}}",
				"entityType": "catalog",
				"i18n": "i18n/defaultCatalogId.properties"
			},
			"payload": {
				"viz": []
			}
		}],
		"groups": [{
			"_version": "3.0.0",
			"identification": {
				"id": "defaultGroupId",
				"title": "{{title}}",
				"entityType": "group",
				"i18n": "i18n/defaultGroupId.properties"
			},
			"payload": {
				"viz": [{
					"id": "com.sap.cpes.refapps.cpsaasapp.risks.display",
					"appId": "com.sap.cpes.refapps.cpsaasapp.risks",
					"vizId": "Risks-display"
				}]
			}
		}],
		"sites": [{
			"_version": "3.0.0",
			"identification": {
				"id": "fe74f769-a0ef-487f-8351-2b470c6cb40f-1587099697547",
				"entityType": "site",
				"title": "SAP Fiori launchpad site on Cloud Foundry",
				"description": "SAP Fiori launchpad site on Cloud Foundry, deployed from SAP Web IDE"
			},
			"payload": {
				"config": {
					"ushellConfig": {
						"renderers": {
							"fiori2": {
								"componentData": {
									"config": {
										"applications": {
											"Shell-home": {}
										},
										"enableSearch": false,
										"enablePersonalization": true,
										"enableSetTheme": true,
										"enableSetLanguage": true
									}
								}
							}
						}
					}
				},
				"groupsOrder": ["defaultGroupId"],
				"sap.cloud.portal": {
					"config": {
						"theme.id": "sap_fiori_3",

[DELETE] 						"theme.active": ["sap_fiori_3", "sap_fiori_3_dark", "sap_belize_hcb", "sap_belize_hcw"],
[DELETE] 						"ui5VersionNumber": "1.75.0"
[DELETE] 
						"theme.active": ["sap_fiori_3", "sap_fiori_3_dark", "sap_belize_hcb", "sap_belize_hcw"]

					}
				}
			}
		}]
	}
}
```

# ui-saas-registry.json

```json hl_lines="0-9"
{
    "xsappname" : "cpsaasapp-ui-dev",
    "appUrls": {
        "onSubscription" : "https://sap-cpes-refapps-dev-cpsaasapp-app.cfapps.sap.hana.ondemand.com/callback/v1.0/tenants/{tenantId}",
        "getDependencies" : "https://sap-cpes-refapps-dev-cpsaasapp-app.cfapps.sap.hana.ondemand.com/callback/v1.0/dependencies"
    },
    "displayName": "Risk Management (UI)",
    "description": "Risk Management SaaS Application (UI)",
    "category": "CAP"
}
```

# user-provided-service.json

```json hl_lines="0-13"
{
	"endpoints": {
		"srv": {
			"url": "https://sap-cpes-refapps-dev-cpsaasapp-srv.cfapps.sap.hana.ondemand.com"
		}
    },
    "uaa": {
        "xsappname": "cpsaasapp-dev!t11998"
    },
	"forwardAuthToken": true,
	"saasregistryappname": "cpsaasapp-dev",
	"saasregistryenabled": true,
	"sap.cloud.service": "com.sap.cpes.refapps.cpsaasapp"
}
```

# xs-security-ui.json

```json hl_lines="0-58"
{
  "xsappname": "cpsaasapp-ui-dev",
  "tenant-mode": "shared",
  "scopes": [
    {
      "name": "$XSAPPNAME.RiskRead",
      "description": "Read Risk"
    },
    {
      "name": "$XSAPPNAME.RiskWrite",
      "description": "Write Risk"
    },
    {
       "name": "$XSAPPNAME.Callback",
       "description": "With this scope set, the callbacks for subscribe, unsubscribe and getDependencies can be called.",
       "grant-as-authority-to-apps": [
          "$XSAPPNAME(application,sap-provisioning,tenant-onboarding)"
       ]
    },
    {
      "name": "uaa.user",
      "description": "UAA"
    }
  ],
  "attributes": [],
  "role-templates": [
    {
      "name": "RiskManager",
      "description": "Manage Risks",
      "scope-references": [
        "$XSAPPNAME.RiskRead",
        "$XSAPPNAME.RiskWrite"
      ],
      "attribute-references": []
    },
    {
      "name": "RiskViewer",
      "description": "Read Risks",
      "scope-references": [
        "$XSAPPNAME.RiskRead"
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
  ],
	"oauth2-configuration": {
		"credential-types": ["binding-secret"],
		"redirect-uris": [
      "https://*-sap-cpes-refapps-dev-cpsaasapp-app.cfapps.sap.hana.ondemand.com/login/callback",
      "https://*.cpes-refapps.int.sap/login/callback"
    ]
	}
}
```

# xs-security.json

```json hl_lines="25-28"
{
  "xsappname": "RiskManagementSaaS",
  "tenant-mode": "shared",
  "scopes": [
    {
      "name": "$XSAPPNAME.RiskRead",
      "description": "Read Risk"
    },
    {
      "name": "$XSAPPNAME.RiskWrite",
      "description": "Write Risk"
    },
    {
       "name": "$XSAPPNAME.Callback",
       "description": "With this scope set, the callbacks for subscribe, unsubscribe and getDependencies can be called.",
       "grant-as-authority-to-apps": [
          "$XSAPPNAME(application,sap-provisioning,tenant-onboarding)"
       ]
    },
    {
      "name": "uaa.user",
      "description": "UAA"
    }
  ],

  "authorities": [
    "$XSAPPNAME.Callback"
  ],

  "attributes": [],
  "role-templates": [
    {
      "name": "RiskManager",
      "description": "Manage Risks",
      "scope-references": [
        "$XSAPPNAME.RiskRead",
        "$XSAPPNAME.RiskWrite"
      ],
      "attribute-references": []
    },
    {
      "name": "RiskViewer",
      "description": "Read Risks",
      "scope-references": [
        "$XSAPPNAME.RiskRead"
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
  ],
  "role-collections": [
    {
      "name": "RiskManagerSaas",
      "description": "Manage Risks",
      "role-template-references": [
        "$XSAPPNAME.RiskManager"
      ]
    },
    {
      "name": "RiskViewerSaas",
      "description": "View Risks",
      "role-template-references": [
        "$XSAPPNAME.RiskViewer"
      ]
    }
  ],
	"oauth2-configuration": {
		"credential-types": ["binding-secret"],
		"redirect-uris": [
      "https://*-sap-cpes-refapps-dev-cpsaasapp-app.cfapps.sap.hana.ondemand.com/login/callback",
      "https://*.cpes-refapps.int.sap/login/callback"
    ]
	}
}
```
undefined
