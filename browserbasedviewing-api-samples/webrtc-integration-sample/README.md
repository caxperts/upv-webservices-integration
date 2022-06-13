# WebrtcIntegrationSample

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.28.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Notes

You need to add the frontend clients url to the UPV WebServices sharedsettings.json for allowing the RedirectUrl.
When omiting this setting, the IdentityServer will respond to a login with the error: "invalid redirect url"

```json
"StreamingConfig": {
    "OidcClient": {
      "RedirectUris": [ "https://localhost:44333/login-redirect", "https://localhost:44333/login-popup" ],
      "PostLogoutRedirectUris": [ "http://localhost:44333" ]
    }
}
```

Make sure the requested BBV model is available on the target server.
This is set in in webrtc.component.ts:

```javascript
this.upvApi.connect("https://demo.universalplantviewer.com/CAXperts/WFS/DemoPlant", 'displayname', this.player.nativeElement);
```

## Common errors

response from serverListing.startInstance {errorMessage: 'Unauthorized role for client: fbb20b0e-78de-46e2-9….universalplantviewer.com/CAXperts/WFS/DemoPlant/'}

-> Current user does not have the necessary user group for accessing this model

Solution: Assign the necessary role to the user and logout/log back in

You can log out when using the premade authentication (sample: login-redirect) by navigating to the IdentityServer Login page (https://localhost:44358/identity/account/login). There is a dropdown on the usernme in the top bar with a logout option.