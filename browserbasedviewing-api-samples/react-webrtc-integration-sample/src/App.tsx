import BBVComponent, { LoginType, VideoConfigProvider } from './BBVComponent';
import { Application } from '@caxperts/universal.api';

const App = () => {
  // The address to the webservices
  const webservicesUrl = 'https://.../UPVWebservices/';
  //the path to the model on the renderserver
  const modelPath = 'modelPath';
  //Path to the loginPopup.html site that handles the login response (see the public folder. If using routher this can be also handled inside the project)
  const popupRedirect = location.origin+"/loginPopup.html";

  //  USE the Universal API (find samples under https://github.com/caxperts/AppControls) on what you can do with the API
  const sendCommand = async () => {
    // Check if a connection to UPV exists
    if (Application.getInstance().available()) {
      // Get a new filter in the 3d enviroment
      const filter = (await Application.getInstance().Scenes3d.get())[0].getNewFilter();
      // Show the Attributes
      filter.IncludeAttributes = true;
      // Log out the selected elements to the console
      console.log(await filter.getSelectedObjects());
      //Show a hello world message in UPV
      Application.getInstance().showMessage("hello world");

    }
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
        modelPath={modelPath}
        videoConfigProvider={provider}
        loginType={LoginType.Redirect}
        popupRedirectUri={popupRedirect}
        onApiReady={(_) => {console.log("API is ready to use")}}
      />

      <button style={{ bottom: "0px", left: "100px", position: "fixed" }} onClick={sendCommand}>
        Send Command
      </button>
    </div>
  );
};

export default App;