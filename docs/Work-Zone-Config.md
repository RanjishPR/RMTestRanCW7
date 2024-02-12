## Subscribe to SAP Build Work Zone, standard edition

1. Enter your **Global Account**. If you are using a trial account, choose **Go To Your Trial Account**.

2. Choose **Account Explorer**.

3. In the **Subaccounts** tab, choose the subaccount where you have deployed your service and application.

    ![Choose Subaccount](markdown/images/choose_subaccount.png)

2. Choose **Services** &rarr; **Service Marketplace** on the left.

3. Search for the **SAP Build Work Zone, standard edition** tile and choose **Create**.

    ![Create SAP Build Work Zone, standard edition](markdown/images/create_workzone_instance.png)

4. Keep the default setting for **Service** and choose `standard - Subscription` for **Plan**.

    ![Choose SAP Build Work Zone, standard edition plan](markdown/images/choose_workzone_plan.png)

    !!! info "SAP Build Work Zone, standard edition offers two types of `standard` plans. The `standard - Subscription` plan is an application plan that lets you access your applications from a central entry point. This is the plan you need for the purposes of this tutorial. The `standard - Instance` plan is a service plan that will let you integrate with other services using APIs. You do not need this plan for the scope of this tutorial."

5. Choose **Create**.

    ![New Instance or Subscription](markdown/images/new_instance_dialog.png)

You have now subscribed to the SAP Build Work Zone, standard edition.

## Assign SAP Build Work Zone, standard edition role collection

You need to assign your user to the `Launchpad_Admin` role collection, so you don't get an error accessing the **SAP Build Work Zone, standard edition** site later on.

1. Choose **Security** &rarr; **Users** on the left.

2. Choose your user.

4. Under **Role Collections** on the right, choose **Assign Role Collection** and assign the `Launchpad_Admin` role collection to your user.

    ![Add role](markdown/images/add_launchpad_admin_role.png)

5. Open another browser or clear your browser's cache.

!!! info "See section [Initial Setup](https://help.sap.com/viewer/8c8e1958338140699bd4811b37b82ece/Cloud/en-US/fd79b232967545569d1ae4d8f691016b.html) in the SAP Build Work Zone, standard edition's documentation for more details."

## Create your SAP Build Work Zone, standard edition site

1. Choose **Services** &rarr; **Instances and Subscriptions** on the left.

2. Locate the **SAP Build Work Zone, standard edition** under **Subscriptions** and choose **Go to Application**.

    ![Instances and Subscriptions](markdown/images/instances_and_subscriptions.png)

3. Choose **Channel Manager** on the left and refresh the `HTML5 Apps` entry there.

    ![Refresh HTML5 Apps](markdown/images/refresh_html5_apps.png)

    !!! info "Content providers aren't reloaded automatically when you push an app, so it's important to manually refresh."

4. Choose **Content Manager** **&rarr;** **Content Explorer** and open the content provider `HTML5 Apps`.

    ![HTML5 Apps Content Provider](markdown/images/html5_apps_content_provider.png)

5. Add the `Risks` and `Mitigations` to **My Content**.

    ![Add Apps to My Content](markdown/images/add_apps_to_my_content.png)

6. Choose **Content Manager** &rarr; **My Content**.

7. In the item list, choose the item `Everyone`.

    ![Role Everyone](markdown/images/role_everyone.png)

    !!! info "`Everyone` is a role that has to be assigned to the `Risks` and `Mitigations` apps so all users can access them."

8. Choose **Edit**, click on the search field, assign the `Risks` and `Mitigations` apps to the role, and choose **Save**.

    ![Add Apps to Role](markdown/images/apps_to_role_everyone.png)

9. Navigate back to **My Content**.

10. Choose **New** &rarr; **Group**.

    ![New Group](markdown/images/new_group.png)

11. Type in `Risk Management` as the title of the group and assign the `Risks` and `Mitigations` apps to it.

    ![Create Group](markdown/images/create_group.png)

    !!! info "This way, you are telling the SAP Build Work Zone, standard edition to display the `Risks` and `Mitigations` apps in a group called `Risk Management`."

12. Choose **Site Directory** &rarr; **Create Site**.

    ![Create Site](markdown/images/create_site.png)

13. Type in `Risk Management Site` for the site name and choose **Create**.

    !!! info "The new site gets the `Everyone` role by default, so you don't have to assign it explicitly. The default site properties are sufficient for the purposes of this tutorial."


## Test your SAP Build Work Zone, standard edition site

1. Choose **Go to site**.

    ![Go to site](markdown/images/go_to_site.png)

    You can see the `Risk Management` group that includes the `Mitigations` and `Risks` apps.

2. Open the `Risks` app.

    ![Risk Management Site](markdown/images/risk_management_site.png)

You have launched your `Risks` app through the SAP Build Work Zone, standard edition.

  ![Risks App](markdown/images/risks.png)

!!! tip "If you choose **Go**, you will get an error because you haven't assigned a role collection to your user yet. We'll do it in the next tutorial."

!!! tip "Do you want to change your Risk Management Site's default theme? Under your avatar, in the User Actions menu, select the Theme Manager."
        ![Theme Manager](markdown/images/theme-manager.png)