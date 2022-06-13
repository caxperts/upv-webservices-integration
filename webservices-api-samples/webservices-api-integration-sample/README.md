# WfsApiIntegrationSample

The WFS API is a REST API secured by the OpenID Connect protocol.

The variables in this example are kept in auth-config.module.ts - wfsUrl/identityServerUrl will probably have to be adjusted to your target system.
The target systems configuration needs to be adjusted as well by adding a "AdditionalClientConfiguration" section on the top level where you set up the necessary client for accessing the API.
For a list of configuration options see http://docs.identityserver.io/en/latest/reference/client.html 

example:

 "AdditionalClientConfiguration": [
    {
      "ClientId": "wfs-api-external",
      "ClientName": "External Wfs Api Access",
      "AllowedGrantTypes": [ "authorization_code" ],
      "RequirePkce": true,
      "RequireClientSecret": false,
      "RequireConsent": false,
      "RedirectUris": [ "http://localhost:4200" ],
      "AllowedScopes": [ "openid", "profile", "wfs_api" ],
      "AlwaysIncludeUserClaimsInIdToken": true
    }
  ]

For a list of available API commands go to .../swagger/index.html - f.e. (https://wfs.universalplantviewer.com/WFS/swagger/index.html)

## Integration overview

Step 1: Obtain access_token over OIDC protocol
in this sample this is handled by angular-auth-oidc)

Step 2: Use obtained access_token in http request in header field ("Authorization": "Bearer <token>")
in this sample this is done using the libraries AuthInterceptor registered in the app.module.ts

## Angular

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


