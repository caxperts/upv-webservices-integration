import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, quickSignIn, UpvWebInterface } from '@caxperts/webrtc';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, interval } from 'rxjs';
import { WebstreamingCreatorService } from '../webstreaming/webstreaming-creator.service';

/**
 * Shows the simple premade authentication method. By calling quickSignin the webrtc package handles token refresh internally
 */
@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.css']
})

export class LoginRedirectComponent implements OnInit, AfterViewInit {

  public upvApi: UpvWebInterface;

  @ViewChild('Container', { read: ViewContainerRef })
  private container: ViewContainerRef;
  @ViewChild('Target', { read: ViewContainerRef })
  private target: ViewContainerRef;

  signalingServerBaseUrl = "https://.../UPVWebservices/";

  userInfo = null;
  initialDimensions = { width: 600, height: 350 };
  resize$ = new BehaviorSubject(this.initialDimensions);
  destroy: any;

  constructor(@Inject('BASE_URL') public baseUrl: string, public route: ActivatedRoute, public router: Router, public oidcSecurityService: OidcSecurityService, public creator: WebstreamingCreatorService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    this.route.queryParams
      .subscribe(params => {

        if (params['code']) {
          AuthenticationService.handleSignInRedirect(window.location.href).then(originUrl => {

            if (originUrl) {
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

  private connect(userInfo) {
    this.upvApi = new UpvWebInterface(this.signalingServerBaseUrl + 'signaling');
    this.upvApi.setUserInfo(userInfo);
    this.userInfo = userInfo;

    interval(2000).subscribe(e => {
      if (!this.container) {
        return;
      }
      let content = this.container.element.nativeElement;
      let width = content.offsetWidth - 10;
      let height = content.offsetHeight;

      this.resize$.next({ width: width, height: height });
    });

    this.creator.attach(this.target, this.resize$, this.upvApi, 'modelpath');

    if (this.destroy) {
      this.destroy();
      this.destroy = null;
    }

    let onConnected = () => {

      //API now available
      let command = this.upvApi.createApiCommand("Select", null, null, "Task=Equipment", null, 1);
      this.upvApi.sendApiCommand(command, r => console.log('result', r));
    };

    window.addEventListener(this.upvApi.connectedEvent, onConnected);

    this.destroy = () => {
      window.removeEventListener(this.upvApi.connectedEvent, onConnected);
    }
  }

  logout() {
    this.oidcSecurityService.logoffLocal();
  }
}
