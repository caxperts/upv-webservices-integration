# upv-webservices-integration
Api integration samples for the [UPV WebServices](https://www.caxperts.com/help/UniversalPlantViewer/UPV%20WebServices%20Overview)
The shown samples are tested for the UPV WebServices 2.1 release

There are 2 separate APIs contained in the UPV WebServices.

1) BrowserBasedViewing API (upvapi)

Embed the BBV window inside your web application and build custom application logic for controlling the BBV UPV

2) UPV WebServices APIf

Call the UPV WebServices server endpoints like adding user groups/creating workflows/...

There are 2 main scenarios here:
    1) Building your own frontend/ using WebServices api in your own frontend
    2) A backend program calling the api f.e. for recurring administrative tasks


# Preparation

You need a running instance of UPV WebServices

In the related samples we use following urls for the servers. You will need to replace them with your running instance.

UPV WebServices: https://localhost:44333
IdentityServer: https://localhost:44


TODO: You can use the public UPV WebServices instance for testing as well