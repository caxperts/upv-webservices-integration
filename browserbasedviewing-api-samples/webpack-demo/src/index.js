import { AuthenticationService, UpvWebInterface, quickSignIn } from '@caxperts/webrtc';

var signalingServerBaseUrl = 'https://localhost:44333/';


let url = new URL(window.location.href);
if (url.searchParams.get('code')) {
    //finish the authentication handshake
    AuthenticationService.handleSignInRedirect(window.location.href).then(originUrl => {
        if(originUrl){
          window.location.href = originUrl;
        }
      });
} else {
    //start the login handshake if not logged in already / starts an OpenID Connect authentication in the background
    quickSignIn(signalingServerBaseUrl, window.location.href).then(userInfo => {
        console.log('got user - start initiating connection', userInfo);
        connect(userInfo);
    });
}

function connect(userInfo) {
    let upvApi = new UpvWebInterface(signalingServerBaseUrl + 'signaling');
    upvApi.setUserInfo(userInfo);

    //instead of setUserInfo: for a more fine-grained control over the authentication mechanism you can do an oidc auth yourself 
    //and pass a function here giving back the current accessToken
    //upvApi.setAccessTokenCall(()=>giveBackToken())
    //TODO: provide example / for now refer to the webservices-api-samples/Client.Csharp sample for a general oidc authentication

    window.addEventListener(upvApi.connectedEvent, () => {
        //API now available
        let command = upvApi.createApiCommand("Select", null, null, "Task=Equipment", null, 1);
        upvApi.sendApiCommand(command, r => console.log('result', r));
    });

    let playerElement = document.getElementById('player');
    upvApi.connect("https://demo.universalplantviewer.com/CAXperts/WFS/DemoPlant", 'displayname', playerElement);
}