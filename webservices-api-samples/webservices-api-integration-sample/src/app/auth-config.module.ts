import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';

export const wfsUrl = "https://localhost:44333";
export const identityServerUrl = "https://localhost:44358"

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: identityServerUrl,
        //needs to redirect to a route where oidcSecurityService.checkAuth is registered
        redirectUrl: `${window.location.origin}`,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'wfs-api-external',
        scope: 'openid profile wfs_api',
        responseType: 'code',
        silentRenew: true,
        silentRenewUrl: `${window.location.origin}/silent-renew.html`,
        renewTimeBeforeTokenExpiresInSeconds: 10,
        logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
        useRefreshToken: false,
        postLoginRoute: `/`,
        secureRoutes: [ wfsUrl ]
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}