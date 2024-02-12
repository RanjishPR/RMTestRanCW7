### Create a Global account

As the result of the previous steps there will be a Cloud Foundry space with required entitlement to deploy the service. This requires the creation of an SAP BTP global account, subaccount, space, and the assignment of the required entitlements.

1. Go to **SAP BTP Control Center**.

    === "SAP"

        [https://int.controlcenter.ondemand.com/index.html](https://int.controlcenter.ondemand.com/index.html)

    === "External"

        [https://controlcenter.ondemand.com/index.html](https://controlcenter.ondemand.com/index.html)

2. Choose the (&#x2B;) button in the upper right corner.

#### Enter account info

1. Enter a global account name.

2. Enter a description.

3. (Optional) If you have a Service Inventory ID, choose the radio button **Yes** under the section **Service Provider Account** and enter it.

    === "SAP"

        [Service Inventory ID](https://jtrack.wdf.sap.corp/browse/SERVICE)

4. Choose **Next**.

#### Enter business info

1. Enter the cost center number.

2. Read & check the disclaimer.

3. Choose **Next**.

#### Assign services

1. Select the services specified in the table in the previous step **Create a Live Account**.

2. Choose **Next**.

#### Set entitlements

1. Set the entitlements from the table in the previous step **Create a Live Account**.

2. Choose the **Add** button for each of them.

3. Choose **Create Account**.

### Create subaccount

1. Go to **SAP BTP Control Center**:

    === "SAP"

        [https://int.controlcenter.ondemand.com/index.html](https://int.controlcenter.ondemand.com/index.html)

    === "External"

        [https://int.controlcenter.ondemand.com/index.html](https://controlcenter.ondemand.com/index.html)

2. Select your global account in the dropdown menu.

3. Choose **Open in cockpit**.

    ![Open global account in cockpit](markdown/images/open_global_account.png)

4. Choose **Account Explorer** in the left navigation pane.

5. Choose **Create** &rarr; **Subaccount**.

    ![Create subaccount](markdown/images/create_subaccount.png)

6. To fill the **New Subaccount** dialog, enter a **Display Name**.

    !!! info "Use a short name for your project and add the prefix for the landscape, for example: `<project name>-cf-us10`. Don’t select the checkbox **Neo**!"

7. Enter a subdomain.

    !!! info "Only valid HTTP domain characters are allowed."

8. Choose **Create**.

9. Wait for the completion of the subaccount creation.

10. Choose the tile with your new subaccount.