# Demo for Eventing Scenario

In this section, lets see the demo on how to test/validate the eventing scenario.

1. Create a new `BusinessPartner` in the SAP S/4HANA system with the following details:

    ![BP](markdown/images/eventing/Demo1.png)
    ![BP2](markdown/images/eventing/Demo2.png)
    ![BP3](markdown/images/eventing/Demo3.png)

2. Choose Industry as `Leisure and Hotel`

    ![BP5](markdown/images/eventing/demo15.png)
3. Save the `BusinessPartner`.
     ![BP4](markdown/images/eventing/Demo4.png)

4. Open the UI application.

5. Choose the `Risks` tile and find the automatically created `Risk` for the newly saved `BusinessPartner`.

     ![Risk1](markdown/images/eventing/Demo16.png)

6. Fill in the other details as shown below, set `Priority` to `1` and `impact` to `100000` and choose **Save**.
    ![Risk2](markdown/images/eventing/Demo6.png)

    After saving the Risk, it should look like this:

    ![Risk1](markdown/images/eventing/Demo7.png)

8. Open the SAP S/4HANA system and open the `BusinessPartner` created in Step 1. Notice the change in `SearchTerm` and the `Lock` status.

    ![BP4](markdown/images/eventing/Demo8.png)
    ![BP5](markdown/images/eventing/Demo9.png)


10. Refresh the UI application. The changes are now reflected in the UI.

    ![Risk2](markdown/images/eventing/Demo11.png)

11. Run the mitigation by editing the `BusinessPartner` in the S/4HANA system, by modifying the  `SearchTerm` and `Central Lock` status as below and choose the **Save** button.

    ![BP6](markdown/images/eventing/Demo12.png)
    ![BP7](markdown/images/eventing/Demo13.png)

12. Refresh the UI application to notice the changes.

     ![Risk3](markdown/images/eventing/Demo14.png)
