import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UpvWebInterface } from '@caxperts/webrtc';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { WebstreamingCreatorService } from '../webstreaming/webstreaming-creator.service';
import { BehaviorSubject, interval } from 'rxjs';

/**
 * Sample for a fully customizable OIDC solution - recommended approach
 */
@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent implements OnInit, AfterViewInit {

  upvApi: UpvWebInterface;
  @ViewChild('Container', { read: ViewContainerRef })
  private container: ViewContainerRef;
  @ViewChild('Target', { read: ViewContainerRef })
  private target: ViewContainerRef;

  signalingServerBaseUrl = "https://localhost:44333/";

  user: any = null;
  initialDimensions = { width: 600, height: 350 };
  resize$ = new BehaviorSubject(this.initialDimensions);
  destroy: any;
  
  constructor(public oidcSecurityService: OidcSecurityService, public creator: WebstreamingCreatorService) { }
  ngOnInit(): void {
    setTimeout(()=>this.oidcSecurityService.userData$.subscribe(u => this.user = u))
  }

  ngAfterViewInit() {

    //required: checkAuth() handles the popup callback when auth suceeded
    this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => {
      console.log('app authenticated', isAuthenticated);
    });

    this.oidcSecurityService.isAuthenticated$.subscribe(e => {
      console.log('is authenticated', e)
      if(e){
        setTimeout(()=>{
          this.connect();
        });
      }
    });
  }

  login() {
    this.oidcSecurityService.authorizeWithPopUp().subscribe(({ isAuthenticated, userData, accessToken, errorMessage }) => {
      console.log(isAuthenticated);
      console.log(userData);
      console.log(accessToken);
      console.log(errorMessage);
    });
  }

  logout() {
    this.oidcSecurityService.logoffLocal();
  }

  private connect() {
    this.upvApi = new UpvWebInterface(this.signalingServerBaseUrl + 'signaling');
    this.upvApi.setAccessTokenCall(() => this.oidcSecurityService.getToken());

    interval(2000).subscribe(e => {
      if (!this.container) {
        return;
      }
      let content = this.container.element.nativeElement;
      let width = content.offsetWidth - 30;
      let height = content.offsetHeight;

      this.resize$.next({ width: width, height: height });
    });

    this.creator.attach(this.target, this.resize$, this.upvApi, 'http://demo.universalplantviewer.com/demoPlant/8/0');

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

  disconnect(){
    if(this.upvApi){
      this.upvApi.disconnect();
    }
  }
}
