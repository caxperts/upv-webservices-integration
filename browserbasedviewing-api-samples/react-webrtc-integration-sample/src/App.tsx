
import { Api } from "@caxperts/universal.api/Internal/APIConnector";
Api.get().debug = true;
import BBVComponent, { LoginType, VideoConfigProvider } from './BBVComponent';
import { Application, AttributeConditionComparison, CombineModes, ConsolidationMode, PackageCondition } from '@caxperts/universal.api';

const App = () => {
  // The address to the webservices
  const webservicesUrl = 'https://....udith.io/';
  //the path to the model on the renderserver
  const modelId = '...';
  //Path to the loginPopup.html site that handles the login response (see the public folder. If using routher this can be also handled inside the project)
  const popupRedirect = location.origin+"/loginPopup.html";

  //  USE the Universal API (find samples under https://github.com/caxperts/AppControls) on what you can do with the API
  const sendCommand = async () => {
    // Check if a connection to UPV exists
    const sceneControl = (await Application.getInstance().Scenes3d.get())[0];
        let filterOp = sceneControl.getNewFilter();
        filterOp.Condition = "Uid=*";
        filterOp.APIPackageFilter = {
                    Name: "APIFilter",
                    Conditions: [
                        // Every first Condition is a base Condition that the other ones are based upon
                        // In this condition we create the condition Area System = Sulphur Recovery Area-A
                        PackageCondition.createAttributeCondition(ConsolidationMode.Base, "Area System", AttributeConditionComparison.Equals, "Sulphur Recovery Area-A"),
                        // The second condition extends the first by defining that Task should be Equipment-
                        PackageCondition.createAttributeCondition(ConsolidationMode.And, "Task", AttributeConditionComparison.Equals, "Equipment"),
                        // The last condition states stat the Name cannot be D-240
                        PackageCondition.createAttributeCondition(ConsolidationMode.AndNot, "Name", AttributeConditionComparison.Equals, "D-240"),
                        //Various other conditions are also possible. Live VolumeConditions or groups / IntelliGroups
                    ]
                }
        filterOp.CombineMode = CombineModes.Or;
        let objects = await filterOp.select();
                Application.getInstance().showMessage("test")
    
  };

  // Optinal but recommended. Specify a Video COnfig Provider that specifies how big the stream will be
  const provider: VideoConfigProvider = {
    getVideoElementWidth(): number {
      return (window.innerWidth || document.body.clientWidth);
    },
    getVideoElementHeight(): number {
      return (window.innerHeight || document.body.clientHeight) * 0.9;
    }
  };

  return (
    <div className="App">
      {/** Embed the BBV UPV in your site */}
      <BBVComponent
        webservicesUrl={webservicesUrl}
        modelID={modelId}
        videoConfigProvider={provider}
        loginType={LoginType.Popup}
        popupRedirectUri={popupRedirect}
        onApiReady={(_) => {console.log("API is ready to use",_, Application.getInstance().available())}}
        serviceToken='...'
      />

      <button style={{ bottom: "0px", left: "100px", position: "fixed" }} onClick={sendCommand}>
        Send Command
      </button>
      <input style={{ bottom: "0px", left: "300px", position: "fixed" }}></input>
    </div>
  );
};

export default App;