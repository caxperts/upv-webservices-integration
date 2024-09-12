import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserManager } from 'oidc-client-ts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  authService: UserManager;
  user:any;

  constructor(public oidcSecurityService: OidcSecurityService){

  }

  ngOnInit(): void {

  }
  title = 'webrtc-integration-sample';

}
