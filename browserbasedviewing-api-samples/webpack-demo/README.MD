# webpack-demo

This project is created using the steps provided in https://webpack.js.org/guides/getting-started/

## How to run the sample

load packages
```
npm install
```

build sources
```
npm run build
```

start a webserver to host the generated ./dist/index.html
it is reachable at http://localhost:4200

This is necessary for the OpenID Connect authentication redirects
```
npm run serve
```

## Notes

You might need to alter the used server urls to match your setup

As of now the @caxperts/webrtc package requires to be run from a browser. Directly calling it f.e. in node is not supported.

The UPV WebServices configuration needs to allow the hosted url
```json
    "StreamingConfig": {
        "OidcClient": {
        "RedirectUris": [ "http://localhost:4200" ],
        "PostLogoutRedirectUris": [ "http://localhost:4200" ]
        }
    }
```

```json
    "AccessControlAllowOrigin": [ "http://localhost:4200" ]
```

