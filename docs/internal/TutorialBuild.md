# Tutorial Build

The tutorial is automatically built on Jenkins after each new commit of the `master` branch. There's no need to build it locally.

Build logs are available here:

* [Build logs](https://cpes.jaas-gcp.cloud.sap.corp/job/CPES/job/CPAppDevelopment/job/master/)
* Build status: [![Build Status](https://cpes.jaas-gcp.cloud.sap.corp/buildStatus/icon?job=CPES%2FCPAppDevelopment%2Fmaster)](https://cpes.jaas-gcp.cloud.sap.corp/job/CPES/job/CPAppDevelopment/job/master/)
* [Build result (SAP-internal tutorial location)](https://pages.github.tools.sap/CPES/CPAppDevelopment/)

The build command is...

*nix:

```sh
# *nix
npm install
./venv/bin/mkdocs build
```

Windows:

```cmd
npm install
./venv/Scripts/mkdocs build
```

You can find the build result in folder `docs-gen`. This folder isn't tracked by GitHub.
