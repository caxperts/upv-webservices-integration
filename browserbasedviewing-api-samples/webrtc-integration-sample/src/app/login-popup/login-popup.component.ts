import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UpvWebInterface } from '@caxperts/webrtc';
import { OidcSecurityService } from 'angular-auth-oidc-client';

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
  @ViewChild('player', { static: false }) player: ElementRef;
  signalingServerBaseUrl = "https://localhost:44333/";

  user: any = null;

  constructor(public oidcSecurityService: OidcSecurityService) { }
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

    window.addEventListener(this.upvApi.connectedEvent, () => {

      //API now available
      let command = this.upvApi.createApiCommand("Select", null, null, "Task=Equipment", null, 1);
      this.upvApi.sendApiCommand(command, r => console.log('result', r));

    });

    this.upvApi.connect("https://demo.universalplantviewer.com/CAXperts/WFS/DemoPlant", 'displayname', this.player.nativeElement);
  }

  disconnect(){
    if(this.upvApi){
      this.upvApi.disconnect();
    }
  }
}
