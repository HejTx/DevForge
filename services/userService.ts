import { auth, db } from "./firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  User 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const signInWithGoogle = async (): Promise<User | null> => {
  // Assign to local variables to allow TypeScript to narrow types correctly
  const firebaseAuth = auth;
  const firebaseDb = db;

  if (!firebaseAuth || !firebaseDb) {
    throw new Error("Firebase not initialized. Check your network or configuration.");
  }

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;

    // Check if user exists in Firestore
    const userRef = doc(firebaseDb, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user profile
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        preferences: {
          level: 'Beginner', // Default
          language: 'Python'
        }
      });
    } else {
      // Update last login
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logoutUser = async () => {
  const firebaseAuth = auth;
  if (!firebaseAuth) return;
  await signOut(firebaseAuth);
};