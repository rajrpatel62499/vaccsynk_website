// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ApiUrl: 'https://api.vaccsynk.com:8000',
  // ApiUrl: 'http://87eed6e3c8d5.ngrok.io',
  PharmacyPortalUrl: 'https://pharmacy.vaccsynk.com/',
  FacilityPortalUrl:'https://facility.vaccsynk.com/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
