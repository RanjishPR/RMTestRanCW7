# Configure event-based communication between SAP S/4HANA and SAP Event Mesh

## Introduction

In this how to guide, you will establish a connection between your SAP S/4HANA system and SAP Event Mesh. This connection is needed to transport events from the SAP S/4HANA system to SAP Event Mesh. 

Additional documentation on configuring trust and creating the RFC destination can be found  in the official guide:
 
https://help.sap.com/viewer/810dfd34f2cc4f39aa8d946b5204fd9c/1809.000/en-US/12559a8c26f34e0bbe8c6d82b7501424.html

**Prerequisite:** SAP S/4HANA System

**Persona:** SAP S/4HANA Developer

### Enable Role for SAP Event Mesh

1. Navigate to Transaction PFCG from GUI.

2. Enter Role as `SAP_IWXBE_RT_XBE_ADM` and Click on Change Icon.

    ![Open SAP Event Mesh Role](markdown/images/eventing/s4h2020/s4h2020_rolename.png)

3. Click on Authorizations Tab and then Click on Change Authorization Data.   

    ![Open Change Authorization](markdown/images/eventing/s4h2020/s4h2020_roleauth.png)

4. Click on Generate.

    ![Select generate](markdown/images/eventing/s4h2020/s4h2020_rolegenerate.png)

5. Popup will appear to generate profile. Click on Generate.

    ![Select Profile](markdown/images/eventing/s4h2020/s4h2020_generatepop.png)

6. Click on OK to generate profile.

    ![Select Profile Generate](markdown/images/eventing/s4h2020/s4h2020_profile.png)

7. Click on Status.

    ![Select Status](markdown/images/eventing/s4h2020/s4h2020_status.png)   

8. A popup will appear to assign full authorization. Click OK. Go Back.

    ![Generate full auth](markdown/images/eventing/s4h2020/s4h2020_statusfull.png)     

9.  Now Authorization is Changed to Green and profile is assigned. Click on Save. Click on User Tab.

    ![Select User](markdown/images/eventing/s4h2020/s4h2020_authcomp.png)    

10. Enter you Technical User and Press Enter. Click on  User Comparison.

    ![Select Comparison](markdown/images/eventing/s4h2020/s4h2020_user.png)   

11. A popup will appear to Compare role user master record. Click on  Full Comparison.

    ![Full Comparison](markdown/images/eventing/s4h2020/s4h2020_usercomp.png)  

12. Once Comaprison has been done. Click on Cancel Icon.

    ![Exit Comparison](markdown/images/eventing/s4h2020/s4h2020_userfull.png)   

13. Now user tab change to green.

    ![Role Assigned](markdown/images/eventing/s4h2020/s4h2020_userdone.png)

### Enable SAP Event Mesh.

1. Enter Transaction `/N/IWXBE/CONFIG`.

    ![Open Transaction](markdown/images/eventing/s4h2020/s4h2020_emstcode.png)

2. Click Via Service Key.

    ![Open Service Key](markdown/images/eventing/s4h2020/s4h2020_emsviakey.png)    

3. Enter any Channel name.
4. Enter any Description.
5. Paste the Service Key of SAP Event Mesh.

    ![Create Channel](markdown/images/eventing/s4h2020/s4h2020_emschannel.png)  

6. Click on Activate.

    ![Activate Channel](markdown/images/eventing/s4h2020/s4h2020_emsactivate.png)  

7. Click on **Check Connection**. If connection was successful, click on **Outbound Bindings**.

    ![Check Connection](markdown/images/eventing/s4h2020/s4h2020_emsconnection.png) 

8. Click on Create icon.

    ![Select Topic](markdown/images/eventing/s4h2020/s4h2020_emstopic.png)  

9. Click on search icon to get list of topic for business event handling.

    ![Search Topic](markdown/images/eventing/s4h2020/s4h2020_emstopicf4.png)  

10. Select the topic `BusinessPartner/Changed/v1` from the list.

    ![Select Topic event](markdown/images/eventing/s4h2020/s4h2020_emsbo.png)  

11. Click on Save.

    ![Save Topic](markdown/images/eventing/s4h2020/s4h2020_emsbotopic.png) 

12. One it's saved, topic will appear in the bindings.

    ![Topic Visible](markdown/images/eventing/s4h2020/s4h2020_emscomp.png)                              







