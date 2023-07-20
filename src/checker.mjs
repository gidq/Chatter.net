import http from "http";
import { getFirestore, collection, getDocs, deleteDoc, doc, getCountFromServer, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';



const firebaseConfig = {
  apiKey: "AIzaSyBljxwjLOuc-257xybd3h5-TwF-vZRO5VY",
  authDomain: "clarssanger.firebaseapp.com",
  projectId: "clarssanger",
  storageBucket: "clarssanger.appspot.com",
  messagingSenderId: "595116263279",
  appId: "1:595116263279:web:c336be76983ba0201a0a9a",
  measurementId: "G-R5B8DJYMB9"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'messages');


const checkDocCount = async () => {
  const querySnapshot = await getDocs(colRef);
  const docCount = querySnapshot.size;

  if (docCount >= 100) {
    console.log("it's true!");
  }
};




const hostname = 'localhost';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

checkDocCount();

onSnapshot(colRef, (snapshot) => {
  const docCount = snapshot.size;
  if (docCount >= 100) {
    console.log("it's true!");
    getDocs(colRef).then((querySnapshot)=>{
      // For each document, create a batch delete operation
      querySnapshot.forEach((red) => {
          let docRef = doc(db, "messages", red.id);

          deleteDoc(docRef);
      });
    });
  } else{
    console.log("it's not");
  }
});