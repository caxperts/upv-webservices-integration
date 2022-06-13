import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { wfsUrl } from './auth-config.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: any = null;

  constructor(public oidcSecurityService: OidcSecurityService, private http: HttpClient) { }

  ngOnInit(): void {
    setTimeout(()=>this.oidcSecurityService.userData$.subscribe(u => this.user = u));

    this.oidcSecurityService.checkAuth().subscribe(e => console.log('authcheck', e));
  }

  login(){
    this.oidcSecurityService.authorize();
  }

  logout(){
    this.oidcSecurityService.logoffLocal();
  }

  result: any[];
  
  getResult(){
    this.http.get(wfsUrl + "/api/identity").subscribe((r: any[]) => {
      this.result = r;
      console.log('got result r', r)
    });
  }
}