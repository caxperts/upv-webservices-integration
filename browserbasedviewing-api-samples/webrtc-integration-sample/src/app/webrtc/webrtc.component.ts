import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, quickSignIn, RedirectStorage, UpvWebInterface, uuidv4 } from '@caxperts/webrtc';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-webrtc',
  templateUrl: './webrtc.component.html',
  styleUrls: ['./webrtc.component.css']
})
export class WebrtcComponent implements OnInit, AfterViewInit {
  upvApi: UpvWebInterface;
  @ViewChild('player', { static: false }) player: ElementRef;

  constructor(@Inject('BASE_URL') public baseUrl: string, public route: ActivatedRoute, public router: Router, public oidcSecurityService: OidcSecurityService) { }
  ngAfterViewInit(): void {

    this.oidcSecurityService
      .isAuthenticated$
      .pipe(filter(isAuthenticated => isAuthenticated), take(1))
      .subscribe(()=>{
        this.router.events
        .subscribe(e => {
          if (e.constructor.name === 'NavigationEnd' && this.router.navigated) {
            this.route.queryParams
              .subscribe(params => {
                const serverUrl = "https://localhost:44333/";
  
                if (params['code']) {
                  console.log('handle redirect');
                  AuthenticationService.handleSignInRedirect().then(value => {
                    const storage = new RedirectStorage();
                    const redirectUrl = storage.pop(value);
                    console.log(`handleSignInRedirect callback: ${value} -> ${redirectUrl}`);
                    document.location.href = redirectUrl;
                    AuthenticationService.handleAutomaticSilentRenew();
                    this.router.navigateByUrl(redirectUrl);
                  });
                } else {
                  quickSignIn(serverUrl, "http://localhost:4200").then(userInfo => {
                    console.log('logged in ', userInfo)
                    this.upvApi = new UpvWebInterface(serverUrl + 'signaling');
                    this.upvApi.setUserInfo(userInfo);
  
                    window.addEventListener(this.upvApi.connectedEvent, () => {
  
                      //API now available
                      let command = this.upvApi.createApiCommand("Select", null, null, "Task=Equipment", null, 1);
                      this.upvApi.sendApiCommand(command, r => console.log('result', r));
  
                    });
  
                    this.upvApi.connect("https://demo.universalplantviewer.com/CAXperts/WFS/DemoPlant", 'displayname', this.player.nativeElement);
                  });
                }
              })
              .unsubscribe();
          }
        });
      });
  }

  ngOnInit() {
  }

}