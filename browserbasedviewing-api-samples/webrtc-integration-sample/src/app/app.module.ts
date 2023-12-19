import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { AuthConfigModule } from './auth-config.module';
import { WebstreamingComponent } from './webstreaming/webstreaming.component';

const routes: Routes = [
  { path: 'login-redirect', component: LoginRedirectComponent },
  { path: 'login-popup', component: LoginPopupComponent },
  { path: '**', redirectTo: 'test' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginRedirectComponent,
    LoginPopupComponent,
    WebstreamingComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {}),
    AuthConfigModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
