import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import config from "../config/config";

const app = firebase.initializeApp(config);
export const firestore = app.firestore();

export const auth = firebase.auth();

export const database = {
  folders: firestore.collection("folders"),
  requestItems: firestore.collection("requestItems"),
  history: firestore.collection("history"),
  formatDoc: (doc: any) => {
    return { id: doc.id, ...doc.data() };
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
};
export default app;
