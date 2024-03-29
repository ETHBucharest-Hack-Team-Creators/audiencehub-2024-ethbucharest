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

  const getDb = () => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    return db;
  };

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

  const getCreators = async () => {
    if (!db) return;
    console.log("getCreators");
    const creatorsRef = collection(db, "creators");

    const q = query(creatorsRef);

    const querySnapshot = await getDocs(q);
    const creators: any = [];
    querySnapshot.forEach(doc => {
      creators.push(doc.data());
    });
    console.log(creators);
    return creators;
  };

  const getCreatorsByAdresses = async (creatorAddressesArray: string[]) => {
    const dbLocal = db ?? getDb();

    if (!dbLocal) return;
    const creatorsRef = collection(dbLocal, "creators");

    const q = query(creatorsRef, where("creator", "in", creatorAddressesArray));

    const querySnapshot = await getDocs(q);
    const creators: any = [];
    querySnapshot.forEach(doc => {
      creators.push(doc.data());
    });
    return creators;
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
    const dbLocal = db ?? getDb();

    const contentsRef = collection(dbLocal, "contents");
    const q = query(contentsRef, where("creator", "==", address));

    const querySnapshot = await getDocs(q);
    const contents: any = [];
    querySnapshot.forEach(doc => {
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
    const dbLocal = db ?? getDb();

    if (!dbLocal) return;
    const contentsRef = collection(dbLocal, "items");

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

  const getItemsByIds = async (docIds: string[]) => {
    const dbLocal = db ?? getDb();
    if (!dbLocal) return;
    try {
      const docRefs = docIds.map(id => doc(dbLocal, "items", id)); // Create references for each ID
      const docPromises = docRefs.map(docRef => getDoc(docRef)); // Create a promise for each document fetch

      const docSnapshots = await Promise.all(docPromises); // Fetch all documents concurrently

      // Filter out non-existing documents and map to data
      const documents = docSnapshots
        .filter(docSnapshot => docSnapshot.exists())
        .map(docSnapshot => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));
      return documents;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  };

  const getFanItems = async (address: string) => {
    const dbLocal = db ?? getDb();

    if (!dbLocal) return;

    const requests = await getFanItemsRequests(address);
    const itemIds = requests.map((item: any) => item.itemId);
    const items = await getItemsByIds(itemIds);
    return items;
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

  // REQUESTS
  const getStreamingRequests = async (address: string) => {
    const dbLocal = db ?? getDb();
    if (!dbLocal) return;
    console.log("getRequests");
    const requestsRef = collection(dbLocal, "creator_requestids", address, "requestids");

    const q = query(requestsRef, where("isOneTimePayment", "==", false));

    const querySnapshot = await getDocs(q);
    const requests: any = [];
    querySnapshot.forEach(doc => {
      requests.push(doc.data());
    });
    return requests;
  };

  const getFanSubscriptions = async (address: string) => {
    const dbLocal = db ?? getDb();
    if (!dbLocal) return;
    console.log("getFunSubscriptions");
    const requestsRef = collection(dbLocal, "fan_requestids", address, "requestids");

    const q = query(requestsRef, where("isOneTimePayment", "==", false));

    const querySnapshot = await getDocs(q);
    const requests: any = [];
    querySnapshot.forEach(doc => {
      requests.push(doc.data());
    });
    return requests;
  };

  const getFanItemsRequests = async (address: string) => {
    const dbLocal = db ?? getDb();
    if (!dbLocal) return;
    const requestsRef = collection(dbLocal, "fan_requestids", address, "requestids");

    const q = query(requestsRef, where("isOneTimePayment", "==", true));

    const querySnapshot = await getDocs(q);
    const requests: any = [];
    querySnapshot.forEach(doc => {
      requests.push(doc.data());
    });
    return requests;
  };

  // const postSablierId = async(address: string, sablierId: string) => {
  //   if (!db) return;
  //   await setDoc(doc(db, "creator_requestids_sablierids", address, "sablierids",sablierId), {
  //     sablierId: sablierId,
  //   })
  // }

  const postRequestIdCreator = async (
    address: string,
    requestid: string,
    isOneTimePayment?: boolean,
    sablierId?: any,
    itemId?: any,
  ) => {
    if (!db) return;
    if (isOneTimePayment === true) {
      try {
        await setDoc(doc(db, "creator_requestids", address, "requestids", requestid), {
          requestid: requestid,
          isOneTimePayment: isOneTimePayment,
          itemId: itemId,
          creator: address
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await setDoc(doc(db, "creator_requestids", address, "requestids", requestid), {
          requestid: requestid,
          isOneTimePayment: isOneTimePayment,
          sablierId: sablierId,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const postRequestIdFan = async (
    address: string,
    requestid: string,
    isOneTimePayment?: boolean,
    sablierId?: any,
    itemId?: string,
    creatorAddress?: string
  ) => {
    if (!db) return;
    if (isOneTimePayment === true) {
      try {
        await setDoc(doc(db, "fan_requestids", address, "requestids", requestid), {
          requestid: requestid,
          isOneTimePayment: isOneTimePayment,
          itemId: itemId,
          creator: creatorAddress
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await setDoc(doc(db, "fan_requestids", address, "requestids", requestid), {
          requestid: requestid,
          isOneTimePayment: isOneTimePayment,
          sablierId: sablierId,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getRequestCreatorIds = async (address: string) => {
    const app = initializeApp(firebaseConfig);
    const dblocal = getFirestore(app);
    const requestsData: any = [];
    // if (!dblocal) return;
    try {
      console.log(address);
      const querySnapshot = await getDocs(collection(dblocal, "creator_requestids", address, "requestids"));
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        requestsData.push({ ...doc.data() });
      });

      return requestsData;
    } catch (error) {
      console.log(error);
    }
  };

const getRequestFanIds = async (address: string) => {
  const app = initializeApp(firebaseConfig);
  const dblocal = getFirestore(app);
  const requestsData: any = [];
  // if (!dblocal) return;
try{
  console.log(address)
  const querySnapshot = await getDocs(collection(dblocal, "fan_requestids", address, "requestids"));
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
    getCreators,
    getCreatorsByAdresses,

    postContent,
    getCreatorContents,
    getContent,

    postOneItem,
    getItems,

    uploadImages,
    

    getStreamingRequests,
    getFanSubscriptions,
    getFanItemsRequests,
    getFanItems,

    postRequestIdFan,
    postRequestIdCreator,
    getRequestCreatorIds,
    getRequestFanIds
  };
}
