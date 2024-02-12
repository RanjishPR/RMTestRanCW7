# CI/CD Pipeline

In this module, we implement a CI/CD pipeline that does a compliant release build (for internal usage) and deploys the application to a Cloud Foundry space.

In later modules we will extend the Pipeline to be able to do a shippable release build and add tests and further checks that are required for this.

The pipeline is implemented using Piper and runs on a Jenkins server.

## Prerequisites

1. A Jenkins server (for example, JaaS)
2. Cloud Foundry technical user that can deploy your application
3. Cloud Foundry technical user configured in Jenkins as credential with id `CF_DEPLOYMENT_USER`
4. GitHub technical user that can write access your repository
5. GitHub technical user configured in Jenkins as credential with id `GITHUB_USER_SSH`
6. GitHub organization configured with GitHub organization plugin in Jenkins

Here is a detailed description of the setup: [Project Setup](https://wiki.wdf.sap.corp/wiki/pages/viewpage.action?pageId=2238798846)

## xMake Setup

We need to do three things for the xMake setup:
1. xMake job configuration
2. xMake build configuration
3. Project in Project Portal

### xMake Job Configuration

To tell xMake which jobs it need to create for the project and how they are configured we create a new branch `config/services` file `production-services/build-service-nova/config.yml` with the following content:

```yaml
attributes:
  milestonestaging: true
  releasestaging: true
  prepareDeployPackage: true
  enable_new_staging: true
  NoPRJobs: true
  NoCIJobs: true
  UpdateGitSubmodules: true
branches:
  - Branch: master
    Type: GITHUB_DEV
```

This will make xMake to create a build a release job for SAP-internal releases (`GITHUB_DEV`) and without further pull request or build on submit (CI) jobs. We don't need these because we will use Piper for that purpose later.

You can run the script `scripts/create-config-services` to create the branch and the file. It requires a clean state of your git workspace (no staged or unstages files).

### xMake Build Configuration

The xMake build configuration tells xMake how to build your project.

Create the file `.xmake.cfg` with the following content:

```properties
[buildplugin]
name=mta
mbt-v2=true
mta-version=latest
mta-group-artifact=com.sap.mta:mta_archive_builder
mtar-group=com.sap.cpes.refapps
mtar-build-target=CF
mbt-v2=true
node-version=12.14.0
noproxy=true
bundle=true

[env_all]
# Need to fetch sqlite3 for tests from internal Nexus.  See https://github.com/mapbox/node-pre-gyp/issues/250.
npm_config_node_sqlite3_binary_host_mirror=http://nexus.wdf.sap.corp:8081/nexus/content/repositories/build.releases.unzip/com/sap/cds/node-sqlite3-binary/4.2.0/node-sqlite3-binary-4.2.0.zip-unzip
```

Important aspects of the configuration are:
* The group (`mtar-group`) of the nexus artifact that is build
* The version of nodejs used (???)
* bundle???

### Project in Project Portal

1. Goto https://projectportal.tools.sap/#/gitHubImport
1. Search for your GitHub project and select it
1. Select Config as code
1. Select xmake Service: `xmake-nova`
1. Click Create Project

## Enable Access to xMake

1. Goto https://xmake-nova.wdf.sap.corp/
1. Click on your user avatar (top right corner)
1. Click Configure
1. Click Add New Token
1. Enter token name: jaas
1. Click Generate
1. Copy token to clipboard
1. Goto JaaS server
1. Create Credentials of type User + Password
1. Enter `id`: `xmakeNova`
1. Enter `user`: *Your user id* (for example, d012345)
1. Enter `password`: *Your copied access token*
1. Save

## Create Pipeline

Creat a file named `Jenkinsfile` with the following content:

```
@Library(['piper-lib', 'piper-lib-os']) _

sapPiperPipeline script: this
```

Create a file named `.pipeline/config.yml` with the following content:

```yaml
general:
  extensionRepository: 'https://github.wdf.sap.corp/MA/cloud-s4-sdk-pipeline-extensions.git'
  buildTool: mta
  artifactType: mta
  gitSshKeyCredentialsId: GITHUB_USER_SSH
  cfApiEndpoint: <cf-api>
  cfCredentialsId: CF_DEPLOYMENT_USER
  cfOrg: <cf-org>
  deployTool: mtaDeployPlugin
stages:
  Acceptance:
    cfSpace: <cf-space>
    testServerUrl: "<url>"
    healthEndpoint: "/health"
steps:
  setVersion:
    artifactType: mta
  cloudFoundryDeploy:
    mtaDeployParameters: "-f --version-rule ALL"
```

You need to replace the following values:
* `<cf-api>` - the URL of the CF API
* `<cf-org>` - the name of the CF org
* `<cf-space>` - the name of the CF
* `<url>` - the URL of your AppRouter application (`...-app` application)

There are some additional command line parameters (`mtaDeployParameters`) for the MTA deployment to ensure that pending deployments are overriden, for example, because they failed, (`-f`) and to ignore the version check (`--version-rule ALL`). Since we already deployed to the "Acceptance Test" space local it already has a higher version then the next deployed version (`1.0.0.` is higher than `1.0.0-xyz`).

## Test It

Now you can commit and push your pipeline. Log in to your Jenkins and check the build progress.

*Note on technical CF user on CANARY landscape:* If you use the EMail

## Add Health Check

```json
        {
            "source": "^/health$",
            "target": "app/health",
            "authenticationType": "none"
        },
```

```yaml
 - name: cpapp-srv
 # ------------------------------------------------------------
   type: nodejs
   path: gen/srv
   properties:
     EXIT: 1  # required by deploy.js task to terminate
   requires:
    # Resources extracted from CAP configuration
    - name: cpapp-db
    - name: cpapp-uaa
   provides:
    - name: srv-binding      # required by consumers of CAP services (e.g. approuter)
      properties:
        srv-url: ${default-url}
    - name: srv-health-binding
      properties:
        srv-health-url: ${default-url}
```

```yaml
modules:
 - name: cpapp-app
   type: nodejs
   path: app
   requires:
    - name: cpapp-uaa
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
```

## Links

* [Piper](https://github.wdf.sap.corp/pages/ContinuousDelivery/piper-doc/)
* [xMake](https://github.wdf.sap.corp/pages/xmake-ci/User-Guide/)