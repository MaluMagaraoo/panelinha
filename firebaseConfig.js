import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGRPwdipyMyVSn1_0zyuAFx3Pw4XKBGuU",
  authDomain: "panelinha-62d98.firebaseapp.com",
  projectId: "panelinha-62d98",
  storageBucket: "panelinha-62d98.firebasestorage.app",
  messagingSenderId: "176940264629",
  appId: "1:176940264629:web:925cd6d5bb27fdc85022fc"
};

const app = initializeApp(firebaseConfig);

export const autenticacao = getAuth(app);
export const bancoDados = getFirestore(app);
