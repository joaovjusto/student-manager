import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB2njB23eoAmfo_YDEkYtLI1OvCqNseQxg",
  authDomain: "student-manager-b6fcb.firebaseapp.com",
  projectId: "student-manager-b6fcb",
  storageBucket: "student-manager-b6fcb.firebasestorage.app",
  messagingSenderId: "886842805898",
  appId: "1:886842805898:web:fbf825a1b3e001c6a0a773"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)

export default app 