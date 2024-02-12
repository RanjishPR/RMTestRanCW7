# External Publishing of the Tutorial

The official SAP process is described here:

* https://wiki.wdf.sap.corp/wiki/display/ospodocs/Sample+Code

## Location

https://github.com/SAP-samples/cloud-cap-risk-management
## Issues

https://github.com/SAP-samples/cloud-cap-risk-management/issues/

## User Management

https://opensource-portal.tools.sap.corp/SAP-samples/teams/cloud-cap-risk-management-team/

## Rules

## Which Content Goes in the External Version

### Example branches

Only the branches marked as `external` in the `examples.yml` file will be included in the external version:

*Example:*

```
  - description: UI5 Freestyle App
    external: true
    branch: cap/freestyle-ui5-app
    baseBranch: cap/fiori-elements-app
    doc: 'Launchpage'
```

Files that match pattern of the file `.tutorial-ignore` are removed from the publishing. The file has the same syntax like `.gitignore` files.

### MkDocs Configuration

There is a dedicated file for external publishing:

```
external/mkdocs.yml
```

### Markdown Files

All markdown files references from the files in the `external/mkdocs.yml` file will be automatically copied in the external version. Images referenced in the files will be copied as well.

#### Profiling of whole pages

You can either just add another page and use that instead of the internal page in the `external/mkdocs.yml` or you can put the file with the same name in the `external/docs` folder. It will be uses instead the one from `docs`.

#### Profiling using Includes

If you want to replace only a part of a file in the external version, you can create an include with that content and put the external version with the same name in `external/docs/includes`.

However, there is a problem with links to other markdown files.

#### Profiling using Tabs

You can use tabs (leaded with `===`) to do some profiling. For the internal version all tabs will be shown, for the external one some get removed.

The following sections and their content get removed:

```
=== "Canary"
```

```
=== "SAP"
```

For `External` sections, the tab header gets removed but the content is put in the output.

```
=== "External"
```

### Additional Files

If additional files should be copied, they can be added to the

```
external/FILES
```

file.

### Example Branches

**@todo**

## Build

1. Merge changes to the main branch in CPAppDevelopment-DEV.
2. run `npm run 1dx-build`.
3. Update your contributions repository.
4. Check the number of files updated (required to validate later) and commit the changes.
5. Push changes to origin, this will be reflected in QA Blue. Validate changes on QA Blue, check the link on the README.md file.
5. Update fork of the external SAP tutorials repository in your github account.
6. Pull changes locally.
7. Copy all the btp-app folders from from contribution repository's docs folder and overwrite into the tutorials repository's docs folder.
8. Delete the *.vr files which are not being updated (The external repository does not have *.vr files for some reason and your PR will not be merged unless you delete these).
```sh
rm tutorials/btp-app-analytics-setup-use/rules.vr
rm tutorials/btp-app-cap-business-logic/rules.vr
rm tutorials/btp-app-cap-mta-deployment/rules.vr
rm tutorials/btp-app-cap-roles/rules.vr
rm tutorials/btp-app-ci-cd-btp/rules.vr
rm tutorials/btp-app-create-cap-application/rules.vr
rm tutorials/btp-app-create-ui-fiori-elements/rules.vr
rm tutorials/btp-app-create-ui-freestyle-sapui5/rules.vr
rm tutorials/btp-app-events-app-setup-s4hc/rules.vr
rm tutorials/btp-app-events-enable-s4hc/rules.vr
rm tutorials/btp-app-events-s4hc-use/rules.vr
rm tutorials/btp-app-ext-service-add-consumption/rules.vr
rm tutorials/btp-app-ext-service-cloud-connector/rules.vr
rm tutorials/btp-app-ext-service-consume-ui/rules.vr
rm tutorials/btp-app-ext-service-intro/rules.vr
rm tutorials/btp-app-ext-service-odata-service/rules.vr
rm tutorials/btp-app-ext-service-s4hana-consume/rules.vr
rm tutorials/btp-app-ext-service-s4hc-register/rules.vr
rm tutorials/btp-app-ext-service-s4hc-use/rules.vr
rm tutorials/btp-app-hana-app-setup/rules.vr
rm tutorials/btp-app-introduction/rules.vr
rm tutorials/btp-app-kyma-add-helm-chart/rules.vr
rm tutorials/btp-app-kyma-deploy-application/rules.vr
rm tutorials/btp-app-kyma-hana-cloud-setup/rules.vr
rm tutorials/btp-app-kyma-launchpad-service-setup/rules.vr
rm tutorials/btp-app-kyma-launchpad-service/rules.vr
rm tutorials/btp-app-kyma-prepare-btp/rules.vr
rm tutorials/btp-app-kyma-prepare-dev-environment/rules.vr
rm tutorials/btp-app-kyma-prepare-xsuaa/rules.vr
rm tutorials/btp-app-kyma-role-assignment/rules.vr
rm tutorials/btp-app-kyma-undeploy-cap-application/rules.vr
rm tutorials/btp-app-launchpad-service-setup/rules.vr
rm tutorials/btp-app-launchpad-service/rules.vr
rm tutorials/btp-app-launchpage/rules.vr
rm tutorials/btp-app-logging-neo-getting-started/rules.vr
rm tutorials/btp-app-logging/rules.vr
rm tutorials/btp-app-prepare-btp/rules.vr
rm tutorials/btp-app-prepare-dev-environment-cap/rules.vr
rm tutorials/btp-app-prepare-xsuaa/rules.vr
rm tutorials/btp-app-role-assignment/rules.vr
rm tutorials/btp-app-undeploy-cap-application/rules.vr
```
9. Check that the number of files remaining matches the number of files you totally updated in tutorials-contribution.
10. Make a PR to the SAP/Tutorials Repository.