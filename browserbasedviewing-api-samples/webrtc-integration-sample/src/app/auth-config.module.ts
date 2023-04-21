import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AuthModule, LogLevel, OidcConfigService } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';

export function configureAuth(oidcConfigService: OidcConfigService) {
  return () =>
    oidcConfigService.withConfig({
      stsServer: 'http://localhost:8080/realms/uws',
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
    });
}

@NgModule({
  imports: [AuthModule.forRoot()],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService],
      multi: true,
    },
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
