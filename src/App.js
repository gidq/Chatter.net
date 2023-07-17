import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter as Router } from 'react-router-dom';
import { getFirestore, collection, getDocs, addDoc, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth(app);
const colRef = collection(db, 'messages');

function App() {
  const [user, setUser] = useState({}); // Define and initialize the user state variable
  const history = useNavigate();
  var username;
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, [user, history]);

  useEffect(() => {
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      let messages = document.getElementById('messages');
      messages.innerHTML = ''; // Clear existing messages
  
      querySnapshot.forEach((doc) => {
        let txt = document.createElement('p');
        txt.textContent = doc.data().Username + " : " + doc.data().Message;
        messages.appendChild(txt);
      });
    });
  
    return () => unsubscribe(); // Unsubscribe from the snapshot listener when component unmounts
  }, []);

  const send = (e) => {
    e.preventDefault();
    let message = document.getElementById('message');
    let messages = document.getElementById('messages');
    if(user){
      
    addDoc(colRef, {
      Message: message.value,
      createdAt: new Date().getTime(), // Add a createdAt field with the current timestamp
      Username: auth.currentUser.displayName
    })
      .then(() => {
        message.value = '';
  
        // Retrieve only the newest message
        const query = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(1));
  
        return getDocs(query);
      })
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Update the 'messages' container with the newest message
          let txt = document.createElement('p');
          messages.appendChild(txt);
        });
      })
      .catch((error) => {
        console.log("Error sending message: ", error);
      });
    } else{
      alert("You have to sign in to use this.");

      message.value = '';
    }
  }

    function SigninWithGoogle() {
      const provider = new GoogleAuthProvider();
      const name = document.getElementById("name");
      signInWithPopup(auth, provider)
        .then((result) => {
          name.textContent = "You're signed in as: " + auth.currentUser.displayName;
          username = result.user.displayName;
          alert(username);
        })
        .catch((error) => {
          alert("There was an error: " + error);
        });
    }

    const signout = () =>{
      auth.signOut();

      const name = document.getElementById("name").textContent = "";
    }
  
    if(user){
      const name = document.getElementById("name");
      if (name) {
      name.textContent = "You're signed in as: " + user.displayName;
      }
    }
  // Sign-in pop-up
  const SignInPopup = () => {
    return <div id="signin-popup">
      <button id="Google-signin" onClick={SigninWithGoogle}>
        Sign-up
      </button>

    </div>;
  };

  const Signout = () => {
    return <div className="signout">

      <button id="signout" onClick={signout}>
        signout
      </button>

    </div>;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatter.app</h1>
        <p id="name">

        </p>
        {user ? <Signout/> : <SignInPopup />}
      </header>

      <div id="messages"></div>
      <form onSubmit={send}>
        <input id="message" type="text" placeholder="Type a message" />
        <button id="send-btn" type="submit">Send</button>
      </form>
      

      
    </div>
  );
}

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
