import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { type Firestore, collection, doc, getFirestore, setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdsL3U3e7kkhFRz6xDC9MWuhzAGLq7cYs",
  authDomain: "ethbucharest-2024.firebaseapp.com",
  projectId: "ethbucharest-2024",
  storageBucket: "ethbucharest-2024.appspot.com",
  messagingSenderId: "297107025242",
  appId: "1:297107025242:web:c7ecf95c3379961ab39763",
};

export function useDB() {
  const [db, setDb] = useState<Firestore>();

  useEffect(() => {
    const app = initializeApp(firebaseConfig);

    const _db = getFirestore(app);
    setDb(_db);
  }, []);

  const postContent = async (id: string, content: string, urls: string[]) => {
    console.log("post content", id);
    if (!db) return;
    try {
      await setDoc(doc(db, "content", id), {
        content,
        urls,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    db,
    postContent,
  };
}
