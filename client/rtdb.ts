import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "chhHp5aG698dbGAoQu78uw8sLufLiqD0OMSOM9PY",
  authDomain: "piedra-papel-tijeras-75b7a.firebaseapp.com",
  databaseURL:
    "https://piedra-papel-tijeras-75b7a-default-rtdb.firebaseio.com/",
});

const rtdb = firebase.database();

export { rtdb };
