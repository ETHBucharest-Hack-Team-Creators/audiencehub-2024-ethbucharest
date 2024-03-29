import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  type Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { type FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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

export function useFB() {
  const [db, setDb] = useState<Firestore>();
  const [storage, setStorage] = useState<FirebaseStorage>();

  useEffect(() => {
    const app = initializeApp(firebaseConfig);

    const _db = getFirestore(app);
    const _storage = getStorage(app);
    setDb(_db);
    setStorage(_storage);
  }, []);

  // CREATORS
  const getCreatorData = async (address: string) => {
    
    const app = initializeApp(firebaseConfig);

    const dblocal = getFirestore(app);

    if (!dblocal) return;
    try {
      const docRef = doc(dblocal, "creators", address);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
        // console.log("Document data:", docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        return { error: "No creator" };
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postCreator = async (
    address: string,
    imgUrl: string,
    bannerURL: string,
    name: string,
    description: string,
    price: number,
  ) => {
    if (!db) return;
    console.log("post creator", address);
    try {
      await setDoc(doc(db, "creators", address), {
        creator: address,
        name,
        imgUrl,
        bannerURL,
        description,
        price,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateCreator = async (address: string, fieldName: string, value: any) => {
    if (!db) return;
    const creatorRef = doc(db, "creators", address);

    await updateDoc(creatorRef, {
      [fieldName]: value,
    });
  };

  // CONTENT
  const postContent = async (address: string, title: string, description: string, imgUrls: (string | undefined)[]) => {
    const id = `${address}_${Date.now()}`;
    if (!db) return;
    try {
      await setDoc(doc(db, "contents", id), {
        creator: address,
        title,
        description,
        imgUrls,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getCreatorContents = async (address: string) => {
    if (!db) return;
    console.log("getContents");
    const contentsRef = collection(db, "contents");

    const q = query(contentsRef, where("creator", "==", address));

    const querySnapshot = await getDocs(q);
    const contents: any = [];
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      contents.push({ id: doc.id, ...doc.data() });
    });
    return contents;
  };

  const getContent = async (id: string) => {
    if (!db) return;
    const docRef = doc(db, "contents", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this caseß
      return { error: "No such content" };
    }
  };

  // ITEM
  const postOneItem = async (address: string, title: string, description: string, price: number, imgUrl: string) => {
    console.log("postOneItem", address);
    const id = `${address}_${Date.now()}`;
    if (!db) return;
    try {
      await setDoc(doc(db, "items", id), {
        creator: address,
        title,
        description,
        price,
        imgUrl,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getItems = async (address: string) => {
 
    const app = initializeApp(firebaseConfig);

    const dblocal = getFirestore(app);


    console.log("db")
    if (!dblocal) return;
    console.log("getItems");
    const contentsRef = collection(dblocal, "items");

    const q = query(contentsRef, where("creator", "==", address));

    const querySnapshot = await getDocs(q);
    const contents: any = [];
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      console.log(doc.data())
      contents.push({ id: doc.id, ...doc.data() });
    });
    return contents;
  };

  // IMAGE
  const uploadImages = async (files: File[]) => {
    const uploadPromises = files.map((file: File) => {
      if (!storage) return Promise.resolve("");
      const fileRef = ref(storage, `uploads/${file.name}`);
      return uploadBytes(fileRef, file).then(snapshot => getDownloadURL(snapshot.ref));
    });
    const downloadUrls = await Promise.all(uploadPromises);
    return downloadUrls;
  };


  // const postSablierId = async(address: string, sablierId: string) => {
  //   if (!db) return;
  //   await setDoc(doc(db, "creator_requestids_sablierids", address, "sablierids",sablierId), {
  //     sablierId: sablierId,
  //   })
  // }

  const postRequestIdCreator = async(address: string, requestid: string, isOneTimePayment?: Boolean, sablierId?: any, itemId?: any ) => {
    if (!db) return;
    if(isOneTimePayment === true) {

      try {
    await setDoc(doc(db, "creator_requestids",address ,"requestids", requestid), {
      requestid: requestid,
      isOneTimePayment: isOneTimePayment,
      itemId: itemId
 
    })
  } catch(error) {
    console.log(error)
  } 
  
  } else {
    try {
      await setDoc(doc(db, "creator_requestids",address ,"requestids", requestid), {
        requestid: requestid,
        isOneTimePayment: isOneTimePayment,
        sablierId: sablierId
      })
    } catch(error) {
      console.log(error)
    } 
  }
}


const postRequestIdFan = async(address: string, requestid: string, isOneTimePayment?: Boolean, sablierId?: any, itemId?:string ) => {
  if (!db) return;
  if(isOneTimePayment === true) {

    try {
  await setDoc(doc(db, "fan_requestids",address ,"requestids", requestid), {
    requestid: requestid,
    isOneTimePayment: isOneTimePayment,
    itemId: itemId

  })
} catch(error) {
  console.log(error)
} 

} else {
  try {
    await setDoc(doc(db, "fan_requestids",address ,"requestids", requestid), {
      requestid: requestid,
      isOneTimePayment: isOneTimePayment,
      sablierId: sablierId
    })
  } catch(error) {
    console.log(error)
  } 
}
}

const getRequestCreatorIds = async (address: string) => {
  const app = initializeApp(firebaseConfig);
  const dblocal = getFirestore(app);
  const requestsData: any = [];
  // if (!dblocal) return;
try{
  console.log(address)
  const querySnapshot = await getDocs(collection(dblocal, "creator_requestids", address, "requestids"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    requestsData.push({ ...doc.data() });

  });

  return requestsData;
} catch(error) {
console.log(error);
}
};

  return {
    db,
    storage,

    getCreatorData,
    postCreator,
    updateCreator,

    postContent,
    getCreatorContents,
    getContent,

    postOneItem,
    getItems,

    uploadImages,
    postRequestIdFan,
    postRequestIdCreator,
    getRequestCreatorIds,
  };
}
