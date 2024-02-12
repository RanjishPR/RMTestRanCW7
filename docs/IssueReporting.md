
# Issue Reporting

Issues found in the development of the tutorial or while testing it should be reported to the respective component.

Also add a note that there is currently an issue in the tutorial module, where the issue occurs, like this:

```
!!! error "@todo: Something does not work &rarr; https://support.sap.com/url/of/issue"
```

## ACH Message Components

| Name                            | ACH Component | Link to report the issue                                                                                                            |
| ------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Fiori Elements                  | CA-UI5-FE     | https://support.wdf.sap.corp/sap/bc/bsp/sap/crm_ui_start/default.htm?saprole=ZCSSINTPROCE                                           |
| SAP Business Application Studio | N/A           | https://sapjira.wdf.sap.corp/projects/DEVXBUGS?selectedItem=com.atlassian.jira.jira-projects-plugin:components-page&contains=CA-BAS |

## Reproduction

1. Open a command line and go to the directory where you want to check out the git repository.

2. Run:

   ```
   git clone https://github.tools.sap/CPES/CPAppDevelopment-devgit
   cd CPAppDevelopment-dev
   git checkout <branch>
   cds watch
   ```

3. Go to `http://localhost:4004/risks/webapp/index.html`.

4. Choose *Risks*.

5. ...

