import WebRTCComponent, { LoginType } from './WebRTCComponent';
import { VideoConfigProvider } from '@caxperts/webrtc';
import { Application } from '@caxperts/universal.api';
import { Api } from '@caxperts/universal.api/Internal/APIConnector';

const App = () => {
  const webservicesUrl = 'https://.../UPVWebservices/';
  const modelPath = 'modelPath';
  const popupRedirect = location.origin+"/loginPopup.html";

  const sendCommand = async () => {
    if (Application.getInstance().available()) {
      Api.get().debug = false;

      const filter = (await Application.getInstance().Scenes3d.get())[0].getNewFilter();
      filter.IncludeAttributes = true;

      console.log(await filter.getSelectedObjects());
      Application.getInstance().showMessage("hello world");

    }
  };

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
      <WebRTCComponent
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