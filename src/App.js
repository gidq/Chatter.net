import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, getDocs, limit } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import './App.css';

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
const db = getFirestore(app);
const auth = getAuth(app);
const colRef = collection(db, 'messages');

function open(navigate){
  navigate("/Chatter.net/account");
}

function Account() {
  const [profilePhotoURL, setProfilePhotoURL] = useState(auth.currentUser ? auth.currentUser.photoURL : null);
  const [profileName, setName] = useState(auth.currentUser ? auth.currentUser.displayName : null);

  const navigate = useNavigate();

  const signout = () => {
    auth.signOut();
    navigate("/Chatter.net/");
    const name = document.getElementById("name");
    if (name) {
      name.textContent = "";
    }
  };

  return (
    <div id="Account">
      <div id="profileContainer">
        {profilePhotoURL && <img src={profilePhotoURL} alt="Profile" id="accountPhoto" onClick={() => alert("change!")} />}
        {profileName && <p>{profileName}</p>}
      </div>
      

      <div id='btn-container'>
        <button id="SignoutAcc" onClick={signout}>Sign Out</button>
        <button id="BackAcc"onClick={() => navigate("/Chatter.net/")}>Back</button>
      </div>

    </div>
  );
}

function App() {
  const [profilePhotoURL, setProfilePhotoURL] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  let username;
  

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setProfilePhotoURL(auth.currentUser.photoURL);
      }
    });
  }, []);

  const q = query(colRef, orderBy("createdAt", "desc"));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = document.getElementById('messages');
      messages.innerHTML = ''; // Clear existing messages

      // Reverse the order of iteration to display old messages at the top
      querySnapshot.docs.reverse().forEach((doc) => {
        let txt = document.createElement('p');
        console.log(doc.data());
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

    if (user) {
      addDoc(colRef, {
        Message: message.value,
        createdAt: new Date().getTime(),
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
            txt.textContent = doc.data().Username + " : " + doc.data().Message;
            messages.appendChild(txt);
          });
        })
        .catch((error) => {
          console.log("Error sending message: ", error);
        });
    } else {
      alert("You have to sign in to use this.");
      message.value = '';
    }
  }

  const SigninWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const name = document.getElementById("name");

    signInWithPopup(auth, provider)
      .then((result) => {
        //name.textContent = "You're signed in as: " + auth.currentUser.displayName;
        username = result.user.displayName;
        setProfilePhotoURL(auth.currentUser.photoURL);
      })
      .catch((error) => {
        alert("There was an error: " + error);
      });
  }

  if (user) {
    const name = document.getElementById("name");
    const profile = document.getElementById("profile");
    if (name) {
      //name.textContent = "You're signed in as: " + user.displayName;
      //setProfilePhotoURL(auth.currentUser.photoURL);
    }
  }

  const SignInPopup = () => {
    return (
      <div id="signin-popup">
        <button id="Google-signin" onClick={SigninWithGoogle}>
          Sign-up
        </button>
        <div id="profile"></div>
      </div>
    );
  };

  const Signout = () => {
    return (
      <div className="signout">
        {/*Load the Avatar*/ }
        {profilePhotoURL && <img src={profilePhotoURL} alt="Profile" id="photo" onClick={() => open(navigate)} />}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatter.app</h1>
        <p id="name"></p>
        {user ? <Signout /> : <SignInPopup />}
      </header>

      <div id="messages"></div>
      <form onSubmit={send}>
        <input id="message" type="text" placeholder="Type a message" />
        <button id="send-btn" type="submit">Send</button>
        </form>
    </div>
  );
}

function WrappedApp(){
  return(
    <Router>
    <Routes>
      <Route path="/Chatter.net/" element={<App />} />
      <Route path="/Chatter.net/account" element={<Account />} />
    </Routes>
  </Router>
  );
}


export default WrappedApp;
