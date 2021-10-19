// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// #region replace emulator suite URLs with production URLs

// const url = `http://localhost:5002/mit-xpro-319116/us-central1/createUserAccount_Authenticated`;
// const url = `http://localhost:5002/mit-xpro-319116/us-central1/getUserAccount_Authenticated`;
// const url = `http://localhost:5002/mit-xpro-319116/us-central1/deposit_Authenticated`;
// const url = `http://localhost:5002/mit-xpro-319116/us-central1/withdraw_Authenticated`;
// const url = `http://localhost:5002/mit-xpro-319116/us-central1/createGoogleUserAccount_Authenticated`;


export const environment = {
  production: false,
  firebase:{
    apiKey: "AIzaSyDlUSLX2lnL2rVddOEZEIAPLags9oIUwbQ",
    authDomain: "mit-xpro-319116.firebaseapp.com",
    projectId: "mit-xpro-319116",
    storageBucket: "mit-xpro-319116.appspot.com",
    messagingSenderId: "371115535761",
    appId: "1:371115535761:web:64ab84016e1a132aa23e30",
    measurementId: "G-24SNKKS4J7"
  },
  url:{
    createUserAccount_Authenticated:`https://us-central1-mit-xpro-319116.cloudfunctions.net/createUserAccount_Authenticated`,
    getUserAccount_Authenticated:`https://us-central1-mit-xpro-319116.cloudfunctions.net/getUserAccount_Authenticated`,
    deposit_Authenticated:`https://us-central1-mit-xpro-319116.cloudfunctions.net/deposit_Authenticated`,
    withdraw_Authenticated:`https://us-central1-mit-xpro-319116.cloudfunctions.net/withdraw_Authenticated`,
    createGoogleUserAccount_Authenticated:`https://us-central1-mit-xpro-319116.cloudfunctions.net/createGoogleUserAccount_Authenticated`
  }
  // url:{
  //   createUserAccount_Authenticated:`http://localhost:5002/mit-xpro-319116/us-central1/createUserAccount_Authenticated`,
  //   getUserAccount_Authenticated:`http://localhost:5002/mit-xpro-319116/us-central1/getUserAccount_Authenticated`,
  //   deposit_Authenticated:`http://localhost:5002/mit-xpro-319116/us-central1/deposit_Authenticated`,
  //   withdraw_Authenticated:`http://localhost:5002/mit-xpro-319116/us-central1/withdraw_Authenticated`,
  //   createGoogleUserAccount_Authenticated:`http://localhost:5002/mit-xpro-319116/us-central1/createGoogleUserAccount_Authenticated`
  // }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
