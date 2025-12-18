import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKopngppZDlq1obee_o5V_XFTrvZEw-HY",
  authDomain: "war-dom-unity.firebaseapp.com",
  projectId: "war-dom-unity",
  storageBucket: "war-dom-unity.firebasestorage.app",
  messagingSenderId: "812704564238",
  appId: "1:812704564238:web:639381e331bf86566b685f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
