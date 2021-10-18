export const environment = {
  production: true,
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

};