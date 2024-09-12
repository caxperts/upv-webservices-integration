# WebrtcIntegrationSample

## Notes

Updated to UWS release 02.05 (using keycloak as identity server)

See documentation for general guidance: https://www.caxperts.com/help/WebServices%20Server/Keycloak%20Installation

This will setup a login on behalf of an individual user account. This means a request is executed in the context of the logged in user.

The sample connects to our public dev server. Please contact support for a test account.


Following configuration steps need to be executed on the keycloak server when hosting yourself:

1) Open admin console on realm "uws"
2) It is recommended to create a new client (type: OpenID Connect) <br/>
This client is used for the access
3) Keep default settings
4) Add necessary redirect URI <br/>
https://localhost:44333/login-redirect <br/>
https://localhost:44333/login-popup
5) Add post logout redirect URI <br/>
http://localhost:44333

The OpenID Connect configuration in the frontend is located in auth-config.module.ts


Make sure the requested BBV model is available on the target server.
The model is requested in the connect call:

```javascript
this.upvApi.connect("http://demo.universalplantviewer.com/demoPlant/10/0", 'displayname', this.player.nativeElement);
```

You can log out when using the premade authentication (sample: login-redirect) by navigating to the IdentityServer Login page (https://localhost:44358/identity/account/login). There is a dropdown on the username in the top bar with a logout option.

## Common errors

### 1
response from serverListing.startInstance {errorMessage: 'Unauthorized role for client: fbb20b0e-78de-46e2-9….universalplantviewer.com/CAXperts/WFS/DemoPlant/'}

-> Current user does not have the necessary user group for accessing this model
-> The model does not exist

Solution: Assign the necessary role to the user and logout/log back in

### 2
invalid redirect uri

Make sure the used OpenID Connect client has your redirect uri in the "Valid redirect URIs" section added

# Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.28.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).