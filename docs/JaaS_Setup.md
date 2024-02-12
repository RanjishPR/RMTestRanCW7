# Setup Jenkins-as-a-Service (JaaS)

A Jenkins instance is required to the CI/CD pipeline. For this purpose Jenkins-as-a-Service (JaaS) is used.

## Create GitHub technical user

1. Goto [https://technical-user-management.github.tools.sap.corp/](https://technical-user-management.github.tools.sap.corp/)
1. Click on Create Service User
1. Enter *name* of user
1. Enter *EMail* from Distribution List (see: [Create Deployment List for Technical User](../howtos/Create_DL_for_Technical_Users))
1. Add *responsibles*
1. Click *Create*

## Create JaaS instance

1. Open [https://jenx.int.sap.eu2.hana.ondemand.com/](https://jenx.int.sap.eu2.hana.ondemand.com/)
1. Create JaaS instance

## Configure GitHub Org

1. Open Jenkins on JaaS instance
1. Click *New Item*
1. Enter name of the *GitHub org*
1. Select *GitHub Organization*
1. Click *Ok*
1. Enter *API Endpoint*: `SAP GITHUB` (`https://github.wdf.sap.corp:...`)

Add *Credentials*

1. Click *Add*: Jenkins
1. Enter your GitHub technical user as user + password. Create a personal access token for your user and use it as a password.

Set *Behaviors*:

1. *Add → Repositories / Filter by name (with wildcard)*
1. Set *Include* to `master PR-*` (You might need to extend it if you want to build further branches in future)
1. Click *Save*

## Add *GitHub WebHooks*

WebHooks are required to automatically trigger builds on the JaaS server, for example, release builds and pull request checks

1. Goto your GitHub organization
1. Goto *Settings > Hooks*
1. Enter *Payload URL*: JaaS URL + `/github-webhook/`
1. Select *Let me select individual events*
1. Select *Pull Requests*, *Pushed*, *Repositories*
1. Click *Create webhook*

## Add SSH Credentials

### Add GitHub user email

1. Goto your JaaS server homepage
1. Goto *Manage Jenkins > Configure System*

Add *Environment Variables*:

1. Add variable
1. Name: `GITHUB_TECHNICAL_USER_EMAIL`
1. Value: `<EMail of your technical GitHub user>`
1. Click *Save*

### Create Job to Generate SSH Key

1. Goto your Jaas server homepage
1. Click *New Item*

Fill *New Item* page:

1. Enter *Name*: `ssh-keygen`
1. Select *Pipeline*
1. Click *Ok*

Fill *Job configuration* page:

1. Pipeline script:

    ```
    node {
        deleteDir()
        sh "ssh-keygen -t rsa -b 4096 -C ${GITHUB_TECHNICAL_USER_EMAIL} -f ./id_rsa -N '' > /dev/null"
        echo """
    -----------------------------------------------------------
    PRIVATE KEY TO BE MAINTAINED IN JENKINS AS SSH CREDENTIALS:
    Note: copy incl. '-----BEGIN ...' AND '-----END' lines
    -----------------------------------------------------------
    ${readFile('id_rsa')}
    -----------------------------------------------------------
    PUBLIC KEY TO BE UPLOADED TO THE GITHUB USER PROFILE VIA
    https://github.wdf.sap.corp/settings/ssh/new:
    -----------------------------------------------------------
    ${readFile('id_rsa.pub')}
    -----------------------------------------------------------"""
        deleteDir()
    }
    ```

1. Click Save

### Generate SSH Key

1. Execute job *ssh-keygen*
1. Click *Console*
1. Select *Timestamps* `None` on the left side
Copy Private Key to clipboard
1. Keep this page open, you need it later again

### Add SSH Private Key to JaaS

1. Goto your JaaS server homepage
1. Click *Credentials*
1. Click System -> Global Credentials
1. Add new credentials of type *SSH Username with private key*
1. Enter *ID*: `GITHUB_USER_SSH`
1. Enter *Description*: `<user name of your github technical user>`
1. Enter: *Username:* `<user name of your github technical user>`
1. Enter *SSH Key*: `<paste copied ssh private key>`
1. Click *OK*

### Add SSH Public Key to GitHub Technical User

1. Goto GitHub homepage: [https://github.wdf.sap.corp](https://github.wdf.sap.corp)
1. Log in with your GitHub technical user
1. Goto *Settings*
1. Click *SSH and GPG Keys*
1. Click *New SSH Key*
1. Goto back to console output of the `ssh-keygen` job, copy public key
1. Go back to *New SSH Key* page on GitHub:
1. Enter *Title*: `jaas`
1. Enter *Key*: `<paste public key from clipboard>`
1. Click *Add SSH Key*

### Delete SSH Key Job Output

1. Go back to console output of the `ssh-keygen` job
1. Delete job output to get rid of the credentials

See also: [Piper > Getting Started > Git SSH Credentials](https://github.wdf.sap.corp/pages/ContinuousDelivery/piper-doc/getting_started/#git-ssh-credentials)

## Create CF Technical User

1. [Create Deployment List for Technical User](../howtos/Create_DL_for_Technical_Users)
1. Add your team DL as DL for the Technical User DL
1. Goto [https://accounts.hana.ondemand.com](https://accounts.hana.ondemand.com)
1. Click Register ...
1. Create a new browser tab
1. Create new entry in the [SAP PassVault](SAP_PassVault.md) for the new user
1. Generate a password there
1. Go back to registration tab
1. Paste generated password
1. Create user
1. Go back to password vault tab
1. Save new entry
1. You will receive a welcome mail
1. Click on link for confirming the email address

## Add Cloud Foundry Technical User to SAP CP

*Add Technical User to CF Org:*

1. Go to SAP BTP Cockpit

{! includes/SAP-BTP-Cockpit.md !}

1. Click *Subaccounts*
1. Select your subaccount
1. Click *Members*
1. Click *Add Members*
1. Select *Organization Manager*
1. Enter EMail-Address of your technical user (For Canary: Enter P-user)
1. Click *Add Members*

*Add Technical User to CF Space:*

1. Click *Spaces*
1. Select your space
1. Click *Members*
1. Click *Add Members*
1. Select *Space Manager*
1. Enter EMail-Address of your technical user (For Canary: Enter P-user)
1. Click *Add Members*

## Add Cloud Foundry Technical User Credentials

1. Goto your JaaS server homepage
1. Click *Credentials*
1. Create new credentials of type *user + password*
1. Enter *id*: `CF_DEPLOYMENT_USER`
1. Enter *name*: `<email from DL of CFDeployment user>`
1. Enter *password*: `<password used for registration>`
1. Click *Save*

