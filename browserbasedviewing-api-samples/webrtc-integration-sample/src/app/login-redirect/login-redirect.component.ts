import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, quickSignIn, UpvWebInterface } from '@caxperts/webrtc';
import { OidcSecurityService } from 'angular-auth-oidc-client';

/**
 * Shows the simple premade authentication method. By calling quickSignin the webrtc package handles token refresh internally
 */
@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.css']
})

export class LoginRedirectComponent implements OnInit, AfterViewInit {

  upvApi: UpvWebInterface;
  @ViewChild('player', { static: false }) player: ElementRef;
  signalingServerBaseUrl = "https://localhost:44333/";

  userInfo = null;

  constructor(@Inject('BASE_URL') public baseUrl: string, public route: ActivatedRoute, public router: Router, public oidcSecurityService: OidcSecurityService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    this.route.queryParams
      .subscribe(params => {

        if (params['code']) {
          AuthenticationService.handleSignInRedirect(window.location.href).then(originUrl => {

            if(originUrl){
              window.location.href = originUrl;
            }
          });
        } else {
          quickSignIn(this.signalingServerBaseUrl, window.location.href).then(userInfo => {

            console.log('got user - start initiating connection', userInfo);

            this.connect(userInfo);
          });
        }
      }).unsubscribe();
  }

  private connect(userInfo){
    this.upvApi = new UpvWebInterface(this.signalingServerBaseUrl + 'signaling');
    this.upvApi.setUserInfo(userInfo);
    this.userInfo = userInfo;

    window.addEventListener(this.upvApi.connectedEvent, () => {

      //API now available
      let command = this.upvApi.createApiCommand("Select", null, null, "Task=Equipment", null, 1);
      this.upvApi.sendApiCommand(command, r => console.log('result', r));

    });

    this.upvApi.connect("https://demo.universalplantviewer.com/CAXperts/WFS/DemoPlant", 'displayname', this.player.nativeElement);
  }

  logout() {
    this.oidcSecurityService.logoffLocal();
  }
}
