import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import readline from 'readline';

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Enter username: ", function(answer) {
    if(answer === ":/admin/Gideon"){
        console.log("Fine");
        rl.question("Enter command: ", function(command){
            if(command === "db.messages.clear()"){
                rl.question("Are you sure, you are clearing all messages in the database", function(answer){
                    if(answer == "yes"){
                        getDocs(colRef).then((querySnapshot)=>{
                            // For each document, create a batch delete operation
                            querySnapshot.forEach((red) => {
                                let docRef = doc(db, "messages", red.id);

                                deleteDoc(docRef);
                                
                            });
                            process.exit();
                        });
                    }
                });
            }
        });
    } else{
        console.log("WRONG!");
        rl.close();
    }
});



