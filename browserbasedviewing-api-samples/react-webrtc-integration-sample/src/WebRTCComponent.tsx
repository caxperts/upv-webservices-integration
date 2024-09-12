import { memo, useEffect, useRef } from 'react';
import { UpvWebInterface, VideoConfigProvider } from '@caxperts/webrtc';
import { UserManager } from 'oidc-client-ts';


interface WebRTCComponentProps {
  webservicesUrl: string;
  modelPath: string;
  onApiReady?: (UpvWebInterface: UpvWebInterface) => void;
  videoConfigProvider?: VideoConfigProvider;
  loginType: LoginType;
  popupRedirectUri: string;
}

export enum LoginType {
  Redirect,
  Popup
}

const WebRTCComponent = memo((props: WebRTCComponentProps) => {
  const playerRef = useRef<HTMLDivElement>(null); // Ref to the player element
  const upvApiRef = useRef<UpvWebInterface | null>(null);
  const pathRef = useRef<string | null>(null);

  let token: string | undefined;

  useEffect(() => {
    //Fix for strict mode development
    if (pathRef.current == props.modelPath) {
      console.log("ignoring");
      return;
    }
    pathRef.current = props.modelPath;

    async function authenticate() {
      const authority = (await (await fetch(`${props.webservicesUrl}signaling/authenticationSettings`)).json())["authority"];
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
      } else {
        const url = new URL(window.location.href);
        if (url.searchParams.get('code')) {
          const user = await manager.signinRedirectCallback();
          window.history.replaceState(null, "", window.location.origin + window.location.pathname);
          token = user.access_token;
        } else {
          await manager.signinRedirect();
        }
      }

      manager.events.addAccessTokenExpiring(() => {
        console.log('Refreshing Token');
        manager.signinSilent().then(u => {
          console.log('Manual signin successful, access token renewed');
          token = u?.access_token;
        }).catch(error => {
          console.log(`Failed to sign in manually in order to renew access token: ${error.message}`);
        });
      });

      const upvApi = new UpvWebInterface(`${props.webservicesUrl}signaling`);
      upvApiRef.current = upvApi;
      upvApi.setAccessTokenCall(() => token!);
      if (props.videoConfigProvider)
        upvApi.videoConfigProvider = props.videoConfigProvider;
      upvApi.connect(props.modelPath, "notused", playerRef.current!);
      window.addEventListener(upvApi.connectedEvent, () => {
        console.log("API is available");
        if (props.onApiReady)
          props.onApiReady(upvApi); // Pass upvApi to the parent via the callback

      });
    }

    authenticate();

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