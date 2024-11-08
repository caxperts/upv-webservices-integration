import { memo, useEffect, useRef } from 'react';
import { UpvWebInterface, VideoConfigProvider } from '@caxperts/webrtc';
import { UserManager } from 'oidc-client-ts';
// Export the VideoConfig Providor again to make our App only Require Imports from this component
export type {VideoConfigProvider} from '@caxperts/webrtc';

//Properties provided to the component
interface BBVComponentProps {
  webservicesUrl: string;
  modelPath: string;
  onApiReady?: (UpvWebInterface: UpvWebInterface) => void;
  videoConfigProvider?: VideoConfigProvider;
  loginType: LoginType;
  popupRedirectUri: string;
  serviceToken?: string
}

// We support Redirect and Popup logins
export enum LoginType {
  Redirect,
  Popup,
  ServiceToken
}

// use memo to not cause a rerender if the parent changes
const WebRTCComponent = memo((props: BBVComponentProps) => {

  const playerRef = useRef<HTMLDivElement>(null);
  const upvApiRef = useRef<UpvWebInterface | null>(null);
  const pathRef = useRef<string | null>(null);

  // Authentication token
  let token: string | undefined;

  useEffect(() => {
    //Fix for strict mode development
    if (pathRef.current == props.modelPath) {
      console.log("ignoring");
      return;
    }
    pathRef.current = props.modelPath;

    // handle authentication and connection in a async sub function
    async function authenticate() {
      //UPVWebservices exposes the authority configured for the login
      const authority = (await (await fetch(`${props.webservicesUrl}signaling/authenticationSettings`)).json())["authority"];
      // Create a usermanager to use for the login process
      const manager = new UserManager({
        authority: authority,
        popup_redirect_uri: props.popupRedirectUri,
        redirect_uri: window.location.href,
        client_id: "signaling",
        scope: "openid profile wfs_api offline_access",
        automaticSilentRenew: true,
        response_type: "code"
      });

      if (props.loginType == LoginType.Popup) {
        const user = await manager.signinPopup();
        token = user.access_token;
      } else if (props.loginType == LoginType.Redirect) {
        const url = new URL(window.location.href);
        if (url.searchParams.get('code')) {
          const user = await manager.signinRedirectCallback();
          window.history.replaceState(null, "", window.location.origin + window.location.pathname);
          token = user.access_token;
        } else {
          await manager.signinRedirect();
        }
      } else if (props.loginType == LoginType.ServiceToken) {
        token = props.serviceToken;
      }

      // if the token is expiering refresh it
      manager.events.addAccessTokenExpiring(() => {
        console.log('Refreshing Token');
        manager.signinSilent().then(u => {
          console.log('Manual signin successful, access token renewed');
          token = u?.access_token;
        }).catch(error => {
          console.log(`Failed to sign in manually in order to renew access token: ${error.message}`);
        });
      });

      // establish the connection to the UPV Stream
      const upvApi = new UpvWebInterface(`${props.webservicesUrl}signaling`);
      upvApiRef.current = upvApi;
      // Provide a fucntion that returns the token
      upvApi.setAccessTokenCall(() => token!);
      // if we specified a video provider forward it
      if (props.videoConfigProvider)
        upvApi.videoConfigProvider = props.videoConfigProvider;
      // when the connection is established notify the parent
      upvApi.onconnect = () => {
        console.log("API is available");
        if (props.onApiReady)
          props.onApiReady(upvApi); // Pass upvApi to the parent via the callback

      };
      // connect to UPV
      upvApi.connect(props.modelPath, "notused", playerRef.current!);
    }
    // Call the async authenticate function
    authenticate();

    // If the component is unmounted call disconnect
    return () => {
      console.log("disconnect");
      upvApiRef.current?.disconnect();
    };
  }, [props.webservicesUrl, props.modelPath, props.onApiReady]);

  return (
    <div>
      <div id="player" ref={playerRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
});

export default WebRTCComponent;