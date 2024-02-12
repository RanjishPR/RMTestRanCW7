
# Tutorial Notes

## Continuous Delivery and Integration

There are two different "Continuous Delivery and Integration" solutions: SAP-intern *Hyper Space* is used to create a *Piper* pipeline. Customers use the *SAP CP CI/CD Service*. This service can't be used internally because it doesn't satisfy all compliance requirements and it's tailored for certain scenarios, for example, specific CAP application scenarios.

Therefore, the tutorial has two separate modules:

| Usage         | Solution          | Documentation           | Branch          | Repo
| ------------- | ----------------- | ----------------------- | --------------- | --
| SAP-internal  | Hyper Space/Piper | docs/CI-CD-Piper-SAP.md | ci-cd-piper-sap | [CPApp-ci-cd-piper-sap](https://github.tools.sap/CPES/CPApp-ci-cd-piper-sap) |
| SAP customers | SAP BTP CI/CD     | docs/CI-CD-BTP.md       | ci-cd-scp       | [CPApp-ci-cd-scp](https://github.tools.sap/CPES/CPApp-ci-cd-scp) |

1. Documentation needs to be written in the *Documentation* file of the `master` [branch](https://github.tools.sap/CPES/CPAppDevelopment-dev).
2. The example code for the pipeline is in the `master` branch of the provided *Repo*, later it will be consolidated back in the example *Branch*. But you don't need to care about that right now.
3. The tutorial uses Markdown with MkDocs specific extensions. It's ok to write plain Markdown.
4. To be able to preview the tutorial, install the software explained in [Software Installation for Tutorial Development](internal/TutorialDevelopmentSetup/#software-installation-for-tutorial-development). Then you can run the command `mkdocs serve` to get a live preview.
5. The two new pages will be in the *Work in Progress* section of the tutorial:
      1. http://127.0.0.1:8000/CI-CD-Piper-SAP/
      2. http://127.0.0.1:8000/CI-CD-BTP/
6. When your documentation is ready, then create a pull request. The tutorial team will be added as reviewer automatically.

### SAP Internal CI/CD Server

* https://cpes.jaas-gcp.cloud.sap.corp/

### Delivery Entities

The following entities have been created to build a real world pipeline based on Hyper Space/Piper including all required checks for compliance. There will be no real delivery.

| Entity                   | Name             | Link                                                                                                                      |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Sirus Delivery           | `CAP Tutorial`   | https://sirius.tools.sap.corp/sirius/#/program/174FC0F529569444B5E8F8B289D2150D/delivery/3B7D3ED953A69F494828E546AC49054F |
| Software Component (SCV) | `CAP_TUTORIAL_1` | https://i7p.wdf.sap.corp/ppmslight/#/details/cv/73555000100200014501/overview                                             |
| Software Component (SC)  | `CAP_TUTORIAL`   | https://i7p.wdf.sap.corp/ppmslight/#/details/c/73555000100100009001/overview                                              |

### Internal Notes (Not Required for Writing the Tutorial)

Add CI/CD repos as additional remote for the tutorial repo:

#### CI-CD-Piper-SAP

Add remote and set tutorial repo as default upstream:

```bash
git branch --set-upstream-to=origin/ci-cd-piper-sap
git remote add pipeline-piper-sap https://github.tools.sap/CPES/CPApp-ci-cd-piper-sap
git fetch pipeline-piper-sap
```

Push it to the `CPApp-ci-cd-piper-sap` repo:

```bash
git push pipeline-piper-sap ci-cd-piper-sap:master
```

#### CI-CD-BTP

Add remote and set tutorial repo as default upstream:

```bash
git branch --set-upstream-to=origin/ci-cd-scp
git remote add pipeline-scp https://github.tools.sap/CPES/CPApp-ci-cd-scp
git fetch pipeline-scp
```

Push it to the `CPApp-ci-cd-scp` repo:

```
git push pipeline-scp ci-cd-scp:master
```
