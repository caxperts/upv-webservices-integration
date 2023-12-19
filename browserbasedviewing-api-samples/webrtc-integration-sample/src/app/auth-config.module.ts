import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';

@NgModule({
  imports: [AuthModule.forRoot({
    config: {
      authority: 'https://localhost:44358',
      //needs to redirect to a route where oidcSecurityService.checkAuth is registered
      redirectUrl: `${window.location.origin}/login-popup`,
      postLogoutRedirectUri: window.location.origin,
      clientId: 'signaling',
      scope: 'openid profile offline_access wfs_api',
      responseType: 'code',
      silentRenew: true,
      silentRenewUrl: `${window.location.origin}/silent-renew.html`,
      renewTimeBeforeTokenExpiresInSeconds: 10,
      logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
      useRefreshToken: true,
      postLoginRoute: `/login-popup`
    }
  })],
  exports: [AuthModule],
})
export class AuthConfigModule {}
