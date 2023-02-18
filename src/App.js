import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Sound from 'react-sound';
import AlertSound from './alert.wav';
import Map from './Map';
import AlertBox from './AlertBox';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';


function App() {

  let config
  config = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
  }
  console.log(config)
  console.log("hello")
  firebase.initializeApp(config);

  const webcamRef = useRef(null);
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";
  const [facingMode, setFacingMode] = useState(FACING_MODE_ENVIRONMENT);

  const [playStatus, setPlayStatus] = useState('STOPPED');


  const videoConstraints = {
    facingMode: FACING_MODE_USER,
  };

  const alertOtherDrivers = () => {
    // get user location
    navigator.geolocation.getCurrentPosition(function (position) {
      // send alert to firebase
      firebase.database().ref('alerts').push({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now()
      });
    });

  }

  const drowsyClassfier = (imageSrc) => {
    return 0.6;
  }

  const detectDrowsy = async (imageSrc) => {
    const drowsy = drowsyClassfier(imageSrc) > 0.5;

    if (drowsy) {
      alertOtherDrivers();
      setPlayStatus('PLAYING');
      // wait 3 seconds, then stop
      setTimeout(() => {
        setPlayStatus('STOPPED');
      }, 3000);

    }

  }

  useEffect(() => {
    // get current user location (this is only to make sure that the browser asks for permission)
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
    });
    // every 5 seconds, take a screenshot and classify it as drowsy or not
    const interval = setInterval(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      detectDrowsy(imageSrc);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="App">
      <Sound url={AlertSound} playStatus={playStatus} />
      <Webcam
        ref={webcamRef}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: "100%",
        }}
        videoConstraints={{
          ...videoConstraints,
          facingMode
        }}
        mirrored={facingMode === FACING_MODE_USER}
      />
      <Map />
      <AlertBox />

    </div>
  );
}

export default App;
