import './App.css';
import React from "react";
import firebase from 'firebase/compat/app';
import Home from './Home';
import Alert from './Alert';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  let config
  config = {
    apiKey: "AIzaSyC4yxkrLO5VzrLQ-ZHFIe0cYlrNKdryMT0",
    authDomain: "sleepy-driver-69884.firebaseapp.com",
    databaseURL: "https://sleepy-driver-69884-default-rtdb.firebaseio.com",
    projectId: "sleepy-driver-69884",
    storageBucket: "sleepy-driver-69884.appspot.com",
    messagingSenderId: "985449650690",
    appId: "1:985449650690:web:ad1edc98ea5f88313c251b",
    measurementId: "G-3LF58J7ENZ"
  }
  firebase.initializeApp(config);

  return (
    <div className="d-flex justify-content-center" style={{ marginTop: 20 }}>
      <Router>
        <Routes>
          <Route exact path="/doze-alert" element={<Home />} />
          <Route path="doze-alert/alert" element={<Alert />} />
        </Routes>
      </Router>
    </div>
  )

}

export default App;
